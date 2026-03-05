import { Controller } from '@nestjs/common';
import { SelfIntroService } from './self-intro.service';

@Controller('self-intro')
export class SelfIntroController {
  
  constructor(private readonly selfIntroService: SelfIntroService) { }

  // @Post('upload-video')
  // async uploadVideo(@Body)
  
}
