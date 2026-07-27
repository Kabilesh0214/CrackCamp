import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { McqService } from './mcq.service';

@Controller('mcq')
export class McqController {
  constructor(private readonly mcqService: McqService) {}

  @Get('questions')
  async getQuestions(@Request() req) {
    return this.mcqService.getQuestions(req);
  }

  @Post('submit')
  async submitQuiz(
    @Request() req,
    @Body() body: { answers: Record<number, string> },
  ) {
    return this.mcqService.submitQuiz(req, body);
  }
}
