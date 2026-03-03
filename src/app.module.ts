import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'redis.module';
import { AuthModule } from './auth/auth.module';


// makes env accessible everywhere
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RedisModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

