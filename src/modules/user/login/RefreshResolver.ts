import {
  Arg, Mutation, Resolver,
} from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { User } from '../../../entity/User';
import { createAccessToken, createRefreshToken } from '../../../utils/auth';
import RefreshResponse from './RefreshResponse';

@Resolver()
export class RefreshResolver {
  @Mutation(() => RefreshResponse, { nullable: true })
  async refresh(
    @Arg('refresh_token') refresh: string,
  ): Promise<RefreshResponse | null> {
    const payload = verify(refresh, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };
    if (!payload) {
      throw new Error('Wrong payload.');
    }

    const user = await User.findOne(payload.userId);
    if (!user) {
      throw new Error('Wrong user.');
    }

    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    };
  }
}
