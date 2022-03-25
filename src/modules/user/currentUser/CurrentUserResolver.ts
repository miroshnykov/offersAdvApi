import {
  Ctx, Query, Resolver, UseMiddleware,
} from 'type-graphql';
import { User } from '../../../entity/User';
import { GqlContext } from '../../../types/GqlContext';
import { auth } from '../../../middlewares/auth';

@Resolver()
export class CurrentUserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(auth)
  async currentUser(
    @Ctx() { payload }: GqlContext,
  ): Promise<User | null> {
    const user = await User.findOne(payload!.userId);

    if (!user) {
      return null;
    }

    return user;
  }
}
