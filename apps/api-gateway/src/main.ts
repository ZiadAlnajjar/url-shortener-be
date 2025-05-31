import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@url-shortener-be/shared';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = 'api';
  const port = configService.get('port');

  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: '/:id', method: RequestMethod.GET }],
  });
  app.use(cookieParser());

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
