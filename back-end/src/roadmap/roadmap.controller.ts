import { Controller, Get, Post, Request } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  async getRoadmap(@Request() req) {
    return this.roadmapService.getRoadmap(req);
  }

  @Post('regenerate')
  async regenerateRoadmap(@Request() req) {
    return this.roadmapService.regenerateRoadmap(req);
  }
}
