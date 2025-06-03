import { registerAs } from '@nestjs/config';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

export enum QUEUES {
  LINK = 'link_queue',
  STATS = 'stats_queue',
}

export const SERVICES = {
  LINK: 'LINK_SERVICE',
  STATS: 'STATS_SERVICE',
};

const loadConfig = () => {
  let config = {};

  if (!process.env.MQ_URL) {
    throw new Error(
      'Missing required environment variable: MQ_URL\n'
      + 'Init .env in libs/shared, then run cpSharedEnv target',
    );
  }

  const RabbitMQ: RmqOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.MQ_URL],
      queueOptions: {
        durable: process.env.NODE_ENV === 'developement',
      },
    },
  };

  let microserviceOptions: MicroserviceOptions;

  switch (process.env.MESSAGE_BROKER) {
    case 'rabbitmq':
      microserviceOptions = RabbitMQ;
      config = {
        microserviceOptions,
        url: microserviceOptions.options?.urls,
        queues: QUEUES,
        services: SERVICES,
      };
      break;
    default:
      throw new Error(
        `Invalid environment variable value for MESSAGE_BROKER\npossible values: rabbitmq`,
      );
  }

  return config;
};

export default registerAs('mq', () => loadConfig());
