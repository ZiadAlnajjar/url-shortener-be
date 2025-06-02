import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import {
  ClickEventPayload,
  ClientInfo,
  OriginalUrlData,
  SERVICES,
} from '@url-shortener-be/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LinkService {
  constructor(
    @Inject(SERVICES.LINK) private linkClient: ClientProxy,
    @Inject(SERVICES.STATS) private statsClient: ClientProxy
  ) {}

  async resolveShortenedUrl(
    shortCode: string,
    clientData: ClientInfo
  ): Promise<string> {
    const resolvedLink: Observable<OriginalUrlData> = this.linkClient.send(
      'resolve_link',
      { shortCode }
    );
    const { id, originalUrl } = await firstValueFrom(resolvedLink);

    const clickPayload: ClickEventPayload = {
      ...clientData,
      linkId: id,
    };
    this.trackClick(clickPayload);

    return originalUrl;
  }

  trackClick(data: ClickEventPayload) {
    this.statsClient.emit('track_click', data);
  }
}
