import { ArgsType, Field } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@ArgsType()
export class GetLinkArgs {
  @Field()
  @IsUrl()
  originalUrl: string;
}
