import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LinkService } from './link.service';
import { ClickEventPayload } from '@url-shortener-be/shared';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const xForwardedFor: string | null = req.headers[
      'x-forwarded-for'
    ] as string;
    const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.ip;

    const clientData: Omit<ClickEventPayload, 'linkId'> = {
      ip,
      referer: req.headers.referer,
      userAgent: req.headers['user-agent'],
    };
    const url = await this.linkService.resolveShortenedUrl(
      shortCode,
      clientData,
    );

    res.redirect(url);
  }
}
