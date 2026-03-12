import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_PROMPT } from './system.prompt';

@Injectable()
export class ChatbotService {

  constructor(
      private prisma: PrismaService,
      @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }
  

  async createConversation(data) {
      const conversation = await this.prisma.conversation.create({
        data: { userId: data.user.userId }
      });

      const conversationId = conversation.id;

      return {conversationId: conversationId};
  }

  async prompt(data) {
    try {

      let conversationId = data.conversationId;

      const redisKey = `chat:${conversationId}`;

      let messages = await this.redis.lrange(redisKey, 0, 9);

      if (messages.length === 0) {

        const dbMessages = await this.prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: "desc" },
          take: 10
        });

        messages = dbMessages.reverse().map(m => JSON.stringify({
          role: m.role,
          content: m.content
        }));

        for (const msg of messages) {
          await this.redis.rpush(redisKey, msg);
        }

        await this.redis.expire(redisKey, 600);
      }

      const conversation = [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
        }
      ];
      
      messages.forEach(m => {
        const parsed = JSON.parse(m);
      
        conversation.push({
          role: parsed.role === "assistant" ? "model" : "user",
          parts: [{ text: parsed.content }]
        });
      });

      conversation.push({
        role: "user",
        parts: [{ text: data.prompt }]
      });

      const model = "gemini-2.5-flash";

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents: conversation }
      );

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      await this.prisma.message.create({
        data: {
          conversationId,
          role: "user",
          content: data.prompt
        }
      });

      await this.prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          content: reply
        }
      });

      await this.redis.rpush(
        redisKey,
        JSON.stringify({ role: "user", content: data.prompt })
      );

      await this.redis.rpush(
        redisKey,
        JSON.stringify({ role: "assistant", content: reply })
      );

      await this.redis.ltrim(redisKey, -10, -1);

      await this.redis.expire(redisKey, 600);

      return { reply };

    } catch (error) {
      return {
        error: error.response?.data || error.message
      };
    }
  }
}
