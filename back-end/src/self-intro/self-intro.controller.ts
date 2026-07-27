import { Controller, Post, Get, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SelfIntroService } from './self-intro.service';
import { memoryStorage } from 'multer';

@Controller('self-intro')
export class SelfIntroController {

  constructor(private readonly selfIntroService: SelfIntroService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video', {
    storage: memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  }))
  async upload(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.selfIntroService.upload(file, req);
  }

  @Get('list')
  async getVideos(@Req() req: any) {
    return this.selfIntroService.getVideos(req.user.userId);
  }

}
