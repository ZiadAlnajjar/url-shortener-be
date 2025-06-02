import { Injectable } from '@nestjs/common';
import { ClickEventPayload } from '@url-shortener-be/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async trackClick(data: ClickEventPayload) {
    await this.prisma.click.create({ data });
  }
}
