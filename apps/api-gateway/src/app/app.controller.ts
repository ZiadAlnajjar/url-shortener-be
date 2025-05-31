import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';
import { type Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping-link')
  async pingLink() {
    return this.appService.pingLinkService();
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/:shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = this.appService.getOriginalUrl(shortCode);
    const url = await firstValueFrom(originalUrl);
    res.redirect(url);
  }
}
