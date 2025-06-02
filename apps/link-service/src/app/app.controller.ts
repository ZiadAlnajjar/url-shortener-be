import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateLinkDto, OriginalUrlData } from '@url-shortener-be/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('ping')
  pingResponder(data: string) {
    console.log('[Link Service] Received:', data);
    return 'pong from link-service';
  }

  @MessagePattern('create_short_link')
  createShortLink(data: CreateLinkDto) {
    return this.appService.createShortenedUrl(data);
  }

  @MessagePattern('resolve_link')
  async resolveLink(data: { shortCode: string }): Promise<OriginalUrlData> {
    const { shortCode } = data;
    return this.appService.getOriginalUrl(shortCode);
  }
}
