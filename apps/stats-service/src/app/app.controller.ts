import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { ClickEventPayload } from '@url-shortener-be/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('ping')
  pingResponder(data: string) {
    console.log('[Stats Service] Received:', data);
    return 'pong from stats-service';
  }

  @EventPattern('track_click')
  async trackClick(@Payload() data: ClickEventPayload) {
    this.appService.trackClick(data);
  }
}
