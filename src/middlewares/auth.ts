import { Logger } from '@milkbox/common-components-backend';
import { verify } from 'jsonwebtoken';
import { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import { GqlContext } from '../types/GqlContext';
import { AuthenticationError } from 'apollo-server-express';

const log = Logger(module);

export const auth: MiddlewareFn<GqlContext> = ({ context }
: ResolverData<GqlContext>, next: NextFn) => {
  const authorisation = context.req.headers.authorization;

  if (!authorisation) {
    throw new AuthenticationError('Not authorized');
  }

  try {
    const token = authorisation.split(' ');
    const payload = verify(token[1], process.env.ACCESS_TOKEN_SECRET!);
    if (token[0] !== 'Bearer') {
      throw new AuthenticationError('Bearer token not valid');
    }
    context.payload = payload as any;
  } catch (error) {
    log.error(error);
    throw new AuthenticationError('Not authorized');
  }

  return next();
};
