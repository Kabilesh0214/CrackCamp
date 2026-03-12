import { Controller, Post, Body, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SelfIntroService } from './self-intro.service';


@Controller('self-intro')
export class SelfIntroController {
  
  constructor(private readonly selfIntroService: SelfIntroService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async upload(@Req() req: any,@UploadedFile() file: Express.Multer.File) {
    return this.selfIntroService.upload(file, req);
  }
  
}
