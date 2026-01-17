import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String, { description: 'Lightweight liveness probe for GraphQL' })
  ping(): string {
    return 'pong';
  }

  @Query(() => String, { description: 'Current API environment' })
  environment(): string {
    return process.env.NODE_ENV ?? 'development';
  }
}
