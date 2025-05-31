import { Inject, Injectable } from '@nestjs/common';
import { SERVICES } from '@url-shortener-be/shared';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject(SERVICES.LINK) private linkClient: ClientProxy) {}

  async pingLinkService() {
    return this.linkClient.send('ping', 'hello from gateway');
  }

  getOriginalUrl(shortCode: string): Observable<string> {
    return this.linkClient.send('resolve_link', { shortCode });
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
