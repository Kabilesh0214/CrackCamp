import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'redis.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SelfIntroModule } from './self-intro/self-intro.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ResourcesModule } from './resources/resources.module';
import { McqModule } from './mcq/mcq.module';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { ResumeModule } from './resume/resume.module';
import { RoadmapModule } from './roadmap/roadmap.module';

// makes env accessible everywhere
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RedisModule,
    DashboardModule,
    SelfIntroModule,
    ChatbotModule,
    ResourcesModule,
    McqModule,
    QuestionBankModule,
    ResumeModule,
    RoadmapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
