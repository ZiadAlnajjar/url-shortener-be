import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Link, NewLinkInput } from '@url-shortener-be/shared';
import { Inject } from '@nestjs/common';
import { SERVICES } from '@url-shortener-be/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Link)
export class LinkResolver {
  constructor(@Inject(SERVICES.LINK) private linkClient: ClientProxy) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => Link)
  async createShortLink(
    @Args('newLikeData') newLinkData: NewLinkInput,
    @Context('clientToken') clientToken: string
  ): Promise<Link> {
    const payload = { ...newLinkData, clientToken };
    const result = this.linkClient.send<Link>('create_short_link', payload);
    return firstValueFrom(result);
  }
}
