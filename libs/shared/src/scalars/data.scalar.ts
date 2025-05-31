import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  parseValue(value: unknown): Date {
    if (typeof value === 'number') {
      return new Date(value);
    }

    throw new Error('Invalid value for DateScalar');
  }

  serialize(value: unknown): number {
    if (value instanceof Date) {
      return value.getTime();
    } else if (typeof value === 'string') {
      const date = new Date(value);
      return date.getTime();
    }

    throw new Error('Invalid value for DateScalar');
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    throw new Error('Invalid literal for DateScalar');
  }
}
