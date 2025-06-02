import { PickType } from '@nestjs/mapped-types';
import { Click } from '../models';

export class ClickEventPayload extends PickType(Click, [
  'linkId',
  'ip',
  'userAgent',
  'referer',
] as const) {}
