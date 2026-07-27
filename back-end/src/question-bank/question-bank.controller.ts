import { Controller, Get, Query, Request } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get('list')
  async getQuestions(
    @Request() req,
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.questionBankService.getQuestions(req, { category, difficulty });
  }
}
