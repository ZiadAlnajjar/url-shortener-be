import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@url-shortener-be/shared';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(ConfigModule);
  const configService = appContext.get(ConfigService);
  const mqConfig = configService.get('mq');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    configService.getMicroserviceOptions('STATS'),
  );

  await app.listen();
  Logger.log(`🚀 Stats Service is listening on ${mqConfig.url}`);
}

bootstrap();
