import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class RoadmapService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async getRoadmap(req) {
    const userId = req.user.userId;

    // Check Redis cache first (30 min TTL)
    const cacheKey = `roadmap:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, username: true },
    });

    const role = user?.role || 'Software Engineer';

    const prompt = `You are a senior tech career coach. Generate a detailed 4-week interview preparation roadmap for a ${role} candidate.

Return ONLY a JSON object in this exact format (no markdown, no code fences):

{
  "role": "${role}",
  "total_weeks": 4,
  "weeks": [
    {
      "week": 1,
      "theme": "<week theme title>",
      "goal": "<1 sentence week goal>",
      "days": [
        {
          "day": "Mon",
          "focus": "<topic>",
          "tasks": ["<task1>", "<task2>", "<task3>"]
        },
        { "day": "Tue", "focus": "<topic>", "tasks": ["<task1>", "<task2>"] },
        { "day": "Wed", "focus": "<topic>", "tasks": ["<task1>", "<task2>"] },
        { "day": "Thu", "focus": "<topic>", "tasks": ["<task1>", "<task2>"] },
        { "day": "Fri", "focus": "<topic>", "tasks": ["<task1>", "<task2>"] },
        { "day": "Sat", "focus": "Practice & Review", "tasks": ["<task1>"] },
        { "day": "Sun", "focus": "Rest & Light Reading", "tasks": ["<task1>"] }
      ],
      "resources": ["<resource1>", "<resource2>"],
      "milestone": "<what the candidate should be able to do by end of week>"
    }
  ],
  "quick_tips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>", "<tip5>"]
}

Make it specific and actionable for a ${role} role. Include real resource names (LeetCode, Neetcode, specific books, etc.). Return ONLY the JSON.`;

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const roadmap = JSON.parse(cleaned);

    // Cache for 30 minutes
    await this.redis.set(cacheKey, JSON.stringify(roadmap), 'EX', 1800);

    return roadmap;
  }

  async regenerateRoadmap(req) {
    const userId = req.user.userId;
    // Bust cache and regenerate
    await this.redis.del(`roadmap:${userId}`);
    return this.getRoadmap(req);
  }
}
