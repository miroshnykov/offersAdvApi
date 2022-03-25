import bcrypt from 'bcrypt';
import {
  Arg, Mutation, Resolver,
} from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { User } from '../../../entity/User';
import { RestorePasswordInput } from './RestorePasswordInput';

@Resolver()
export class RestorePasswordResolver {
  @Mutation(() => Boolean)
  async restorePassword(
    @Arg('data') { token, password }: RestorePasswordInput,
  ): Promise<boolean> {
    try {
      const payload = verify(token, process.env.CONFIRM_TOKEN_SECRET!) as { entity: string };
      console.log(payload);
      if (!payload || !payload.entity) {
        return false;
      }
      const user = await User.findOne({
        where: {
          email: payload.entity,
        },
      });
      if (!user) {
        return false;
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      user.verified = new Date();
      user.password = hashedPassword;
      await user.save();

      return true;
    } catch (e) {
      return false;
    }
  }
}
