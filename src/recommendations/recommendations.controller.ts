import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { ConciergeChatDto } from './dto/chat.dto';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendations: RecommendationsService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Rule-based wedding concierge chat (public)' })
  @ApiResponse({
    status: 201,
    description: 'Assistant message + recommendations',
  })
  chat(@Body() dto: ConciergeChatDto) {
    return this.recommendations.chat({
      message: dto.message,
      context: dto.context,
    });
  }
}
