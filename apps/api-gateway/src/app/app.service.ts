import { Inject, Injectable } from '@nestjs/common';
import { SERVICES } from '@url-shortener-be/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject(SERVICES.LINK) private linkClient: ClientProxy) {}

  async pingLinkService() {
    return this.linkClient.send('ping', 'hello from gateway');
  }
}
