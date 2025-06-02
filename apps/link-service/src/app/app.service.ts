import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConfigService,
  CreateLinkDto,
  Link,
  OriginalUrlData,
} from '@url-shortener-be/shared';
import { nanoid } from 'nanoid';
import { retryUntil } from '../utils/retryUntil.util';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async createShortenedUrl(data: CreateLinkDto): Promise<Link> {
    const expiresIn = this.configService.get<number>('url.expires_in');
    const expiresAt = new Date(Date.now() + expiresIn);
    const domain = this.configService.get<number>('url.domain');

    const shortenUrl = () => domain + '/' + nanoid(6);
    const isShortenedUrlExists = async (url: string) =>
      !!(await this.prisma.link.findFirst({
        where: { shortenedUrl: url },
      }));
    let shortenedUrl = shortenUrl();

    if (await isShortenedUrlExists(shortenedUrl)) {
      shortenedUrl = await retryUntil(
        () => shortenUrl(),
        (res) => !isShortenedUrlExists(res)
      );
    }

    const link = await this.prisma.link.create({
      data: {
        ...data,
        shortenedUrl,
        expiresAt,
      },
    });

    return link;
  }

  async getOriginalUrl(shortCode: string): Promise<OriginalUrlData> {
    const link = await this.prisma.link.findFirst({
      where: {
        shortenedUrl: {
          endsWith: `/${shortCode}`,
        },
      },
    });

    if (!link) {
      throw new Error('Link not found');
    }

    const { id, originalUrl } = link;
    return { id, originalUrl };
  }
}
