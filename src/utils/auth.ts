import { sign } from 'jsonwebtoken';
import { Logger } from '@milkbox/common-components-backend';
import { User } from '../entity/User';

const log = Logger(module);

const reqs = [
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ADMIN_API_SECRET',
  'CONFIRM_TOKEN_SECRET',
  'RESTORE_TOKEN_SECRET',
];
const mustBeSet = reqs.filter((r) => !process.env[r]);
if (mustBeSet.length > 0) {
  log.error(`${mustBeSet.join(', ')} must be set`);
}

export const createAccessToken = (user: User): string => sign(
  { userId: user.id, tokenVersion: user.token_version },
  process.env.ACCESS_TOKEN_SECRET!,
  { expiresIn: '1h' },
);

export const createRefreshToken = (user: User): string => sign(
  { userId: user.id, tokenVersion: user.token_version },
  process.env.REFRESH_TOKEN_SECRET!,
  { expiresIn: '7d' },
);

export const createAdminApiAuthToken = (entity: string): string => sign(
  { entity },
  process.env.ADMIN_API_SECRET!,
);

export const createConfirmationToken = (entity: string): string => sign(
  { entity },
  process.env.CONFIRM_TOKEN_SECRET!,
  { expiresIn: '1d' },
);

export const createRestoreToken = (entity: string): string => sign(
  { entity },
  process.env.CONFIRM_TOKEN_SECRET!,
  { expiresIn: '1d' },
);
