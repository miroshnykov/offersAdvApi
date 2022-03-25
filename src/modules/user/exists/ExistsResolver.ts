import { Arg, Query, Resolver } from 'type-graphql';
import { User } from '../../../entity/User';

@Resolver()
export class ExistsResolver {
  @Query(() => Boolean)
  async userExists(
    @Arg('email') email: string,
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    return !!user;
  }
}
