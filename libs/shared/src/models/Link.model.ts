import { Link as LinkModel } from '@prisma/client-link';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@ObjectType({ description: 'link' })
export class Link implements LinkModel {
  @Field(() => ID)
  id: string;

  @Field()
  @IsUrl()
  originalUrl: string;

  @Field()
  shortenedUrl: string;

  @Field()
  clientToken: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  expiresAt: Date | null;

  @Field({ nullable: true })
  deletedAt: Date | null;
}
