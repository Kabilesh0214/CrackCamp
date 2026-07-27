import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Ollama } from 'ollama';
const pdfParse = require('pdf-parse');

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}

  async analyseResume(req, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = req.user.userId;

    // Get user role for context-aware analysis
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const roleLabel = user?.role || 'Software Engineer';

    // Extract text from PDF using pdf-parse
    let resumeText: string;
    try {
      const pdfData = await pdfParse(file.buffer);
      resumeText = pdfData.text;
    } catch (err) {
      throw new BadRequestException('Failed to parse PDF file. Please ensure the file is a valid PDF.');
    }

    if (!resumeText || resumeText.trim().length < 50) {
      throw new BadRequestException('Could not extract enough text from the PDF. The file may be image-based or empty.');
    }

    const prompt = `You are a senior tech recruiter and career coach specializing in the ${roleLabel} domain.

Here is the text content extracted from a resume PDF:

---
${resumeText.substring(0, 8000)}
---

Analyse this resume and provide structured feedback in the following exact JSON format (no markdown, no explanation outside the JSON):

{
  "overall_score": <number 0-100>,
  "strengths": [<list of 3-5 specific strengths as strings>],
  "weaknesses": [<list of 3-5 specific weaknesses/gaps as strings>],
  "missing_keywords": [<list of 5-10 important keywords/skills missing for a ${roleLabel} role>],
  "improvement_tips": [<list of 4-6 specific, actionable improvement tips as strings>],
  "summary": "<2-3 sentence overall assessment>"
}

Return ONLY the JSON object, no other text.`;

    try {
      const response = await ollama.chat({
        model: OLLAMA_MODEL,
        messages: [{ role: 'user', content: prompt }],
        format: 'json',
      });

      const rawText = response.message.content;

      // Strip markdown code fences if present
      const cleaned = rawText.replace(/```json|```/g, '').trim();

      const parsed = JSON.parse(cleaned);

      // Persist the analysis result to the database
      await this.prisma.resumeAnalysis.create({
        data: {
          userId,
          fileName: file.originalname,
          overallScore: parsed.overall_score ?? 0,
          summary: parsed.summary ?? '',
          strengths: parsed.strengths ?? [],
          weaknesses: parsed.weaknesses ?? [],
          missingKeywords: parsed.missing_keywords ?? [],
          improvementTips: parsed.improvement_tips ?? [],
        },
      });

      return parsed;
    } catch (error) {
      console.error('Resume analysis error:', error.message);
      throw new BadRequestException('Failed to analyse resume. Please try again.');
    }
  }

  async getHistory(userId: string) {
    const analyses = await this.prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { analysedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        fileName: true,
        overallScore: true,
        summary: true,
        analysedAt: true,
      },
    });

    return analyses;
  }
}
