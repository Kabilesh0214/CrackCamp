import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req) {
    return this.dashboardService.getStats(req.user.userId);
  }

  @Get('dsa/progress')
  async getDsaProgress(@Request() req) {
    return this.dashboardService.getDsaProgress(req.user.userId);
  }

  @Post('dsa/toggle')
  async toggleDsaSubtopic(
    @Request() req,
    @Body() body: { topicId: number; subtopicName: string },
  ) {
    return this.dashboardService.toggleDsaSubtopic(
      req.user.userId,
      body.topicId,
      body.subtopicName,
    );
  }
}
