import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import Express, { Response } from 'express';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Logger } from '@milkbox/common-components-backend';
import { createSchema } from './utils/createSchema';
import { GqlContext } from './types/GqlContext';
import { getBuildInfo } from './utils/getBuildInfo';
import pjson from '../package.json';

const log = Logger(module);

declare module 'express-session' {
  export interface Session {
    userId: number
  }
}

async function main() {
  const schema = await createSchema();
  try {
    await createConnection();
  } catch (error: any) {
    log.error(error.message, error.stack);
    process.exit(1);
  }
  const serverConfig: { schema: GraphQLSchema; context: any } = {
    schema,
    context: ({ req, res }: GqlContext) => ({ req, res }),
  };

  const server = new ApolloServer(serverConfig as ApolloServerExpressConfig);
  const app = Express();

  app.use(cookieParser());

  app.use(cors({
    credentials: true,
    origin: '*',
  }));

  app.get('/api/v1/health', getBuildInfo(pjson.version));
  app.get('/api/v1/health1', getBuildInfo(pjson.version));

  try {
    server.applyMiddleware({ app, path: '/api/v1/graphql' });
  } catch (error: any) {
    log.error(error.message, error.stack);
  }
  const PORT = process.env.NODE_PORT || 4000;
  app.listen(PORT, () => {
    log.info(`server is running on PORT http://localhost:${PORT}${server.graphqlPath}`);
  });
}

main();
