import { Field, InputType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@InputType()
export class CreateLinkDto {
  @Field()
  @IsUrl()
  originalUrl: string;

  @Field()
  clientToken: string;
}
