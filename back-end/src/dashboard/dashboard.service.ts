import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async getStats(userId: string) {
    // 1. DSA Progress: count completed subtopics & calculate streak
    const dsaProgress = await this.prisma.dsaProgress.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    const totalSubtopics = 79; // Total subtopics across all 15 DSA topics
    const completedSubtopics = dsaProgress.length;
    const dsaStreak = this.calculateStreak(dsaProgress.map(d => d.completedAt));

    // 2. MCQ Attempts: recent scores + average
    const mcqAttempts = await this.prisma.mcqAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    const mcqAvgScore = mcqAttempts.length > 0
      ? Math.round(mcqAttempts.reduce((sum, a) => sum + Math.round((a.score / a.total) * 100), 0) / mcqAttempts.length)
      : null;

    const mcqTotalAttempts = await this.prisma.mcqAttempt.count({ where: { userId } });

    // 3. Resume Analysis: latest score
    const latestResume = await this.prisma.resumeAnalysis.findFirst({
      where: { userId },
      orderBy: { analysedAt: 'desc' },
    });

    const resumeAnalysisCount = await this.prisma.resumeAnalysis.count({ where: { userId } });

    // 4. Roadmap: check if cached
    const roadmapCached = await this.redis.get(`roadmap:${userId}`);
    const hasRoadmap = !!roadmapCached;

    return {
      dsa: {
        completedSubtopics,
        totalSubtopics,
        streak: dsaStreak,
        percentage: Math.round((completedSubtopics / totalSubtopics) * 100),
      },
      mcq: {
        averageScore: mcqAvgScore,
        totalAttempts: mcqTotalAttempts,
        recentAttempts: mcqAttempts.map(a => ({
          score: a.score,
          total: a.total,
          percentage: Math.round((a.score / a.total) * 100),
          completedAt: a.completedAt,
        })),
      },
      resume: {
        latestScore: latestResume?.overallScore ?? null,
        latestSummary: latestResume?.summary ?? null,
        totalAnalyses: resumeAnalysisCount,
        lastAnalysedAt: latestResume?.analysedAt ?? null,
      },
      roadmap: {
        generated: hasRoadmap,
      },
    };
  }

  // DSA Progress methods
  async getDsaProgress(userId: string) {
    const progress = await this.prisma.dsaProgress.findMany({
      where: { userId },
    });

    // Group by topicId
    const grouped: Record<number, string[]> = {};
    for (const p of progress) {
      if (!grouped[p.topicId]) grouped[p.topicId] = [];
      grouped[p.topicId].push(p.subtopicName);
    }

    return grouped;
  }

  async toggleDsaSubtopic(userId: string, topicId: number, subtopicName: string) {
    // Check if already completed
    const existing = await this.prisma.dsaProgress.findUnique({
      where: {
        userId_topicId_subtopicName: {
          userId,
          topicId,
          subtopicName,
        },
      },
    });

    if (existing) {
      // Un-complete it
      await this.prisma.dsaProgress.delete({
        where: { id: existing.id },
      });
      return { completed: false, topicId, subtopicName };
    } else {
      // Mark as completed
      await this.prisma.dsaProgress.create({
        data: {
          userId,
          topicId,
          subtopicName,
        },
      });
      return { completed: true, topicId, subtopicName };
    }
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    // Get unique days (ignore time)
    const uniqueDays = [...new Set(
      dates.map(d => {
        const date = new Date(d);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    )].sort().reverse();

    if (uniqueDays.length === 0) return 0;

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    // Streak must start from today or yesterday
    if (uniqueDays[0] !== todayKey && uniqueDays[0] !== yesterdayKey) {
      return 0;
    }

    let streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      // Check if consecutive day (simple approach)
      const current = new Date(uniqueDays[i - 1].replace(/-/g, '/'));
      const prev = new Date(uniqueDays[i].replace(/-/g, '/'));
      const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
