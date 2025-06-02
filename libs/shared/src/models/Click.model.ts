import { Click as ClickModel } from '@prisma/client-stats';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class Click implements ClickModel {
  @IsString()
  id: string;

  @IsString()
  linkId: string;

  @IsDate()
  timestamp: Date;

  @IsOptional()
  @IsString()
  userAgent: string | null;

  @IsOptional()
  @IsString()
  ip: string | null;

  @IsOptional()
  @IsString()
  referer: string | null;
}
