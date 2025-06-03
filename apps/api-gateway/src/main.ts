import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@url-shortener-be/shared';
import cookieParser from 'cookie-parser';
import { type Express } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = 'api';
  const port = configService.get('port');

  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  const expressApp = app.getHttpAdapter().getInstance() as Express;
  expressApp.disable('x-powered-by');

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
