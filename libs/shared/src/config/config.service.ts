import { Injectable } from '@nestjs/common';
import { ConfigService as NestJSConfigService } from '@nestjs/config';
import { ClientProvider, MicroserviceOptions } from '@nestjs/microservices';
import { QUEUES } from './config/transporter';

@Injectable()
export class ConfigService extends NestJSConfigService {
  getMicroserviceOptions<T = TransporterOptions>(options: object): T;
  getMicroserviceOptions<T = TransporterOptions>(
    queue: keyof typeof QUEUES,
    options?: object,
  ): T;

  getMicroserviceOptions<T = TransporterOptions>(
    arg1: keyof typeof QUEUES | object,
    arg2: object = {},
  ): T {
    if (typeof arg1 === 'object') {
      const microserviceOptions = this.get('mq.microserviceOptions');

      return {
        ...microserviceOptions,
        options: {
          ...microserviceOptions.options,
          ...arg1,
        },
      } as T;
    } else if (arg1 in QUEUES) {
      return this.getMicroserviceOptions({
        ...arg2,
        queue: QUEUES[arg1],
      }) as T;
    }

    throw new Error('Invalid arguments provided');
  }

  isDev(): boolean {
    const nodeEnv = this.get('node_env');

    return nodeEnv === 'development';
  }

  isProd(): boolean {
    const nodeEnv = this.get('node_env');

    return nodeEnv === 'production';
  }
}

type TransporterOptions = MicroserviceOptions | ClientProvider;
