import { registerAs } from '@nestjs/config';

const EXPIRES_IN_MS = 8 * 60 * 60 * 1000;

export default registerAs('url', () => ({
  expires_in: EXPIRES_IN_MS,
  domain: process.env.DOMAIN,
  length: 6,
}));
