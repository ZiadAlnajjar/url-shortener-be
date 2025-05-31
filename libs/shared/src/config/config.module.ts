import { Module } from '@nestjs/common';
import { ConfigModule as NestJSConfigModule } from '@nestjs/config';
import url from './config/url';
import transporter from './config/transporter';
import configuration from './config/configuration';
import { ConfigService } from './config.service';
import * as path from 'path';

const devSharedEnvFile = path.join(__dirname, '../.env.shared');
const devEnvFile = path.join(__dirname, '../.env');
const prodSharedEnvFile = path.join(__dirname, '.env.shared');
const prodEnvFile = path.join(__dirname, '.env');

@Module({
  imports: [
    NestJSConfigModule.forRoot({
      isGlobal: true,
      skipProcessEnv: true,
      cache: true,
      expandVariables: true,
      envFilePath: [
        devSharedEnvFile,
        devEnvFile,
        prodSharedEnvFile,
        prodEnvFile,
      ],
      load: [configuration, transporter, url],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
