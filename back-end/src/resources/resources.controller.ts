import { Controller, Get, Request, Body } from '@nestjs/common';
import { ResourcesService } from './resources.service';


@Controller('resources')
export class ResourcesController {

  constructor(private readonly resourcesService: ResourcesService) { }

  @Get('skills')
  async getSkills(@Request() req) {
    return this.resourcesService.getSkills(req)
  }

  @Get('tutorials')
  async getTutorials(@Body() body) {
    return this.resourcesService.getTutorials(body)
  }

  @Get('books')
  async getBooks(@Body() body) {
    return this.resourcesService.getBooks(body)
  }
}
