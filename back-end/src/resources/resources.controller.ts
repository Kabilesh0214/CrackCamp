import { Controller, Get, Query, Request } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {

  constructor(private readonly resourcesService: ResourcesService) { }

  @Get('skills')
  async getSkills(@Request() req) {
    return this.resourcesService.getSkills(req);
  }

  @Get('tutorials')
  async getTutorials(@Query('skill') skill: string) {
    return this.resourcesService.getTutorials({ skill });
  }

  @Get('books')
  async getBooks(@Request() req, @Query('skill') skill: string) {
    return this.resourcesService.getBooks({ skill });
  }
}
