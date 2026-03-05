import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'redis.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SelfIntroModule } from './self-intro/self-intro.module';
import { ChatbotModule } from './chatbot/chatbot.module';


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
    ChatbotModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

