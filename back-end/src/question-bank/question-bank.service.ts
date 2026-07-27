import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionBankService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(req, query: { category?: string; difficulty?: string }) {
    const userId = req.user.userId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user?.role) {
      return { error: 'Role not set' };
    }

    const where: any = { role: user.role };
    if (query.category) where.category = query.category;
    if (query.difficulty) where.difficulty = query.difficulty;

    const questions = await this.prisma.interviewQuestion.findMany({
      where,
      orderBy: [{ category: 'asc' }, { difficulty: 'asc' }],
    });

    return questions;
  }
}
