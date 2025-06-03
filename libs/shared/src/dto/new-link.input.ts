import { Field, InputType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@InputType()
export class NewLinkInput {
  @Field()
  @IsUrl()
  originalUrl: string;
}
