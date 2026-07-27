import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SelfIntroService {
  constructor(private prisma: PrismaService) {}

  async upload(video: Express.Multer.File, req) {
    if (!video) {
      throw new BadRequestException('No video file uploaded');
    }

    const userId = req.user.userId;

    // Save to local uploads directory (fallback for when AWS S3 is not configured)
    const uploadsDir = path.join(process.cwd(), 'uploads', 'self-intro');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${userId}-${Date.now()}-${video.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, video.buffer);

    // Save record to database
    const selfIntro = await this.prisma.selfIntro.create({
      data: {
        userId,
        title: video.originalname,
        description: `Self-introduction video uploaded on ${new Date().toLocaleDateString()}`,
        videoUrl: `/uploads/self-intro/${fileName}`,
      },
    });

    return {
      success: true,
      message: 'Video uploaded successfully',
      selfIntro: {
        id: selfIntro.id,
        title: selfIntro.title,
        videoUrl: selfIntro.videoUrl,
        createdAt: selfIntro.createdAt,
      },
    };
  }

  async getVideos(userId: string) {
    const videos = await this.prisma.selfIntro.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        createdAt: true,
      },
    });

    return videos;
  }
}
