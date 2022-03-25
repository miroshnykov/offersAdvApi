import { Logger } from '@milkbox/common-components-backend';
import { createConfirmationToken, createRestoreToken } from './auth';

const log = Logger(module);

const reqs = ['NODE_DOMAIN', 'NODE_PROTOCOL'];
const mustBeSet = reqs.filter((r) => !process.env[r]);
if (mustBeSet.length > 0) {
  log.error(`${mustBeSet.join(', ')} must be set`);
}

const conf = {
  protocol: process.env.NODE_PROTOCOL || 'http',
  domain: process.env.NODE_DOMAIN || 'localhost',
  port: process.env.NODE_PORT || 4000,
};

export const getUrl = () => {
  let url = `${conf.protocol}://${conf.domain}`;
  if (conf.port && process.env.NODE_ENV === 'development') {
    url += `:${conf.port}`;
  }
  url += '/';
  return url;
};

export const createConfirmationUrl = async (email: string): Promise<string> => {
  const token = createConfirmationToken(email);
  return `${getUrl()}auth/confirm/${token}`;
};

export const createRestorePasswordUrl = async (email: string): Promise<string> => {
  const token = createRestoreToken(email);
  return `${getUrl()}auth/restore/${token}`;
};
