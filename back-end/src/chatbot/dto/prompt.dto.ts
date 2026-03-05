import { IsString } from "class-validator"

export class PromptDto {

  @IsString()
  conversationId?: string

  @IsString()
  prompt: string
}