import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HealthResolver {
  @Query()
  health(): string {
    return 'version number 0.0.1';
  }
}
