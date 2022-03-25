import { Request, Response } from 'express';

export const getBuildInfo = (version: string) => {
  const buildInfo = {
    build: process.env.API_BUILD || 'unknown',
    version,
    date: process.env.API_DATE || 'unknown',
    commit: process.env.API_GIT_COMMIT || 'unknown',
  };
  return (req: Request, res: Response) => {
    res.send(buildInfo);
  };
};
