import { Injectable, Inject } from '@nestjs/common';
import { Ollama } from 'ollama';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { SYSTEM_PROMPT } from './system.prompt';

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

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

      // Build Ollama message format
      const ollamaMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];

      messages.forEach(m => {
        const parsed = JSON.parse(m);
        ollamaMessages.push({
          role: parsed.role === 'assistant' ? 'assistant' : 'user',
          content: parsed.content,
        });
      });

      ollamaMessages.push({
        role: 'user',
        content: data.prompt,
      });

      const response = await ollama.chat({
        model: OLLAMA_MODEL,
        messages: ollamaMessages,
      });

      const reply = response.message.content;

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
        error: error.message || 'Ollama request failed'
      };
    }
  }
}
