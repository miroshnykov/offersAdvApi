import { Arg, Mutation, Resolver } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { User } from '../../../entity/User';

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg('token') token: string,
  ): Promise<boolean> {
    try {
      const payload = verify(token, process.env.CONFIRM_TOKEN_SECRET!) as any;
      if (!payload || !payload.entity) {
        return false;
      }
      const user = await User.findOne({
        where: {
          email: payload.entity,
          verified: null,
        },
      });

      if (!user) {
        return false;
      }

      user.verified = new Date();
      await user.save();

      return true;
    } catch (e) {
      return false;
    }
  }
}
