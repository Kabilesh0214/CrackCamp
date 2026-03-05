import { Module } from '@nestjs/common';
import { SelfIntroController } from './self-intro.controller';
import { SelfIntroService } from './self-intro.service';

@Module({
  controllers: [SelfIntroController],
  providers: [SelfIntroService]
})
export class SelfIntroModule {}
