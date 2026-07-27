import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class McqService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(req) {
    const userId = req.user.userId;

    // Get the user's role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user?.role) {
      return { error: 'Role not set' };
    }

    // Fetch 10 random questions for this role
    const allQuestions = await this.prisma.mcqQuestion.findMany({
      where: { role: user.role },
    });

    // Shuffle and take 10
    const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);

    // Strip correct answer before sending to client
    return shuffled.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: {
        A: q.optionA,
        B: q.optionB,
        C: q.optionC,
        D: q.optionD,
      },
    }));
  }

  async submitQuiz(req, body: { answers: Record<number, string> }) {
    const userId = req.user.userId;
    const { answers } = body;

    // Get user role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Fetch all questions that were answered
    const questionIds = Object.keys(answers).map(Number);
    const questions = await this.prisma.mcqQuestion.findMany({
      where: { id: { in: questionIds } },
    });

    let score = 0;
    const breakdown = questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return {
        id: q.id,
        question: q.question,
        yourAnswer: userAnswer,
        correctAnswer: q.correctAnswer,
        correct: isCorrect,
        explanation: q.explanation,
        options: {
          A: q.optionA,
          B: q.optionB,
          C: q.optionC,
          D: q.optionD,
        },
      };
    });

    // Save attempt
    await this.prisma.mcqAttempt.create({
      data: {
        userId,
        role: user?.role || 'Unknown',
        score,
        total: questions.length,
      },
    });

    return {
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      breakdown,
    };
  }
}
