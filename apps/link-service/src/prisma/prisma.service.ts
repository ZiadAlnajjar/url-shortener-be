import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client-link';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  private readonly softDeletableModels = ['Link'];

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.$extends(this.softDeleteExtension());
    this.setupLogging();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private setupLogging() {
    this.$on('error', ({ message }) => this.logger.error(message));
    this.$on('warn', ({ message }) => this.logger.warn(message));
    this.$on('info', ({ message }) => this.logger.debug(message));
    this.$on('query', ({ query, params }) =>
      this.logger.log(`${query}; ${params}`),
    );
  }

  private softDeleteExtension() {
    return {
      query: {
        $allModels: {
          async findMany({ model, args, query }) {
            return this.applySoftDeleteFilter(model, args, query);
          },

          async findFirst({ model, args, query }) {
            return this.applySoftDeleteFilter(model, args, query);
          },

          async findUnique({ model, args, query }) {
            return this.applySoftDeleteFilter(model, args, query, 'findFirst');
          },

          async delete({ model, args, query }) {
            return this.applySoftDeleteFilter(model, args, query, 'update', {
              deletedAt: new Date(),
            });
          },
        },
      },
    };
  }

  private isSoftDeletable(model: string): boolean {
    return this.softDeletableModels.includes(model);
  }

  private applySoftDeleteFilter(
    model: string,
    args: Record<string, object>,
    query: (args: object) => void,
    operation?: string,
    data: object = {},
  ) {
    if (!this.isSoftDeletable(model)) {
      return query(args);
    }

    const modifiedArgs = this.addSoftDeleteFilter(args, data);

    if (operation) {
      const context = Prisma.getExtensionContext(this);
      return (context as unknown)[operation](modifiedArgs);
    }

    return query(modifiedArgs);
  }

  private addSoftDeleteFilter(args: Record<string, object>, data: object = {}) {
    return {
      ...args,
      where: {
        ...args?.where,
        deletedAt: null,
      },
      data: {
        ...args?.data,
        ...data,
      },
    };
  }
}
