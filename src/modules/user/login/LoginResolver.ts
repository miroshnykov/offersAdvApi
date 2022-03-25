import {
  Arg, Mutation, Resolver,
} from 'type-graphql';
import bcrypt from 'bcrypt';
import { User } from '../../../entity/User';
import LoginResponse from './LoginResponse';
import { createAccessToken, createRefreshToken } from '../../../utils/auth';
import { UserStatus } from '../../../constants/UserStatus';

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Arg('email') email: string,
      @Arg('password') password: string,
  ): Promise<LoginResponse | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Wrong Username or Password');
    }

    const isPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordsMatch) {
      throw new Error('Wrong Username or Password');
    }

    if (!user.verified) {
      throw new Error('You haven\'t verified your email yet.');
    }

    if (user.status === UserStatus.PENDING) {
      throw new Error('You are not verified by manager yet.');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new Error('This user is inactive for login. Please contact support to take more info.');
    }

    if (user.status === UserStatus.BLACKLISTED) {
      throw new Error('Your account has been terminated due to serious policy breach.');
    }

    if (user.status === UserStatus.REJECTED) {
      throw new Error('This account does not exist.');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new Error(`Your account has been suspended.
      Please check your email for policy message, or reach out to your account manager.`);
    }

    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
      user,
    };
  }
}
