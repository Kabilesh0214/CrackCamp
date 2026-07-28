import { Injectable, Inject } from '@nestjs/common';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_PROMPT } from './system.prompt';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async createConversation(data) {
    const conversation = await this.prisma.conversation.create({
      data: { userId: data.user.userId },
    });

    return { conversationId: conversation.id };
  }

  async prompt(data) {
    try {
      const conversationId = data.conversationId;
      const redisKey = `chat:${conversationId}`;

      // Load last 10 messages from Redis or DB
      let rawMessages = await this.redis.lrange(redisKey, 0, 9);

      if (rawMessages.length === 0) {
        const dbMessages = await this.prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });

        rawMessages = dbMessages.reverse().map((m) =>
          JSON.stringify({ role: m.role, content: m.content }),
        );

        for (const msg of rawMessages) {
          await this.redis.rpush(redisKey, msg);
        }

        await this.redis.expire(redisKey, 600);
      }

      // Build Gemini conversation history (must alternate user/model)
      const history: Content[] = rawMessages
        .map((m) => JSON.parse(m))
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      // Start Gemini chat with history
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(data.prompt);
      const reply = result.response.text();

      // Persist to DB
      await this.prisma.message.create({
        data: { conversationId, role: 'user', content: data.prompt },
      });
      await this.prisma.message.create({
        data: { conversationId, role: 'assistant', content: reply },
      });

      // Update Redis cache
      await this.redis.rpush(
        redisKey,
        JSON.stringify({ role: 'user', content: data.prompt }),
        JSON.stringify({ role: 'assistant', content: reply }),
      );
      await this.redis.ltrim(redisKey, -10, -1);
      await this.redis.expire(redisKey, 600);

      return { reply };
    } catch (error) {
      console.error('Chatbot error:', error.message);
      return { error: error.message || 'Gemini request failed' };
    }
  }
}
