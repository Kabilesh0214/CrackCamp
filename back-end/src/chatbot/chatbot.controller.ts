import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { PromptDto } from './dto/prompt.dto';

@Controller('chatbot')
export class ChatbotController {

  constructor(private readonly chatbotService: ChatbotService) { }

  @Post('create-conversation') 
  async createConversation(@Req() req: any) {
    return this.chatbotService.createConversation(req);
  }

  @Post('prompt')
  async prompt(@Body() body: PromptDto) {
    return this.chatbotService.prompt(body);
  }

}
