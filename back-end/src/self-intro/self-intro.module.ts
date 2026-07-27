import { Module } from '@nestjs/common';
import { SelfIntroController } from './self-intro.controller';
import { SelfIntroService } from './self-intro.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SelfIntroController],
  providers: [SelfIntroService],
})
export class SelfIntroModule {}
