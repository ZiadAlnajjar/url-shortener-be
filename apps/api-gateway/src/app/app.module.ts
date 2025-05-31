import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  SERVICES,
  ConfigModule,
  ConfigService,
  DateScalar,
} from '@url-shortener-be/shared';
import { ClientsModule } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { generateToken } from '../utils/generateToken';
import { LinkResolver } from './link/link.resolver';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        graphiql: configService.isDev(),
        autoSchemaFile: 'schema.gql',
        sortSchema: true,
        context: ({ req }) => {
          const clientToken = req.cookies?.clientToken ?? generateToken();
          if (!req.cookies?.clientToken) {
            req.res?.cookie('clientToken', clientToken);
          }
          return { clientToken };
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: SERVICES.LINK,
        useFactory: async (configService: ConfigService) =>
          configService.getMicroserviceOptions('LINK'),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: SERVICES.STATS,
        useFactory: async (configService: ConfigService) =>
          configService.getMicroserviceOptions('STATS'),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [AppService, LinkResolver, DateScalar],
  controllers: [AppController],
})
export class AppModule {}
