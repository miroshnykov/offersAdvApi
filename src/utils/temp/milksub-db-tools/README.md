### Syncing db
First install `@milksub/milkbox-db-utils`:
```shell script
npm install --save-dev @milksub/milkbox-db-utils
```

Prepare `package.json`:
```json
{
//...
  "scripts": {
    "sync": "ts-node --files node_modules/@milksub/milkbox-db-utils/sync.ts",
  }
//...
}
```

Make sure your `tsconfig.json` has the `ts-node` section:
```json
{
  "ts-node": {
    "ignore": [ "/node_modules/(?!@milksub/milkbox-db-utils)" ]
  }
}
```

To sync run:
```shell script
npm run sync
```

This will sync database using the `default` connection name. If you want to use another connection name do:
```shell script
npm run sync remote-dev
```

You may wish to use `force` argument. This will `truncate` everything from a database prior to syncing:
```shell script
npm run sync force
npm run sync force remote-dev
npm run sync remote-dev force
```
> Note
> Arguments order is not important. The only restriction is: you can't name your connections as "force".


### Testing with database

First install `@milksub/milkbox-db-utils`:
```shell script
npm install --save-dev @milksub/milkbox-db-utils
```

To configure connection to a test database use:
```dotenv
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=service_test
TEST_DB_CONNECT=postgres
TEST_DB_USER=postgres
TEST_DB_PASWD=************
TEST_DB_SCHEMA=service
```

To setup jest open your `jest.config.ts`. Add `globalSetup, globalTeardown, setupFiles` options like this:

```javascript
module.exports = {
//...
  globalSetup: '@milksub/milkbox-db-utils/setupTestDb.js',
  globalTeardown: '@milksub/milkbox-db-utils/dbDrop.ts',
  setupFiles: [
    '<rootDir>/tests/setupTests.ts'
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@milksub/milkbox-db-utils/.*)'
  ]
//...
};
```

In the `setupFiles.ts` do:
```typescript
import dotenv from 'dotenv';

dotenv.config();
``` 

And finally inside your test suite import models:

> **IMPORTANT!**
> Use `connect` from `'@milksub/milkbox-db-utils/testConnection'` inside `beforeAll`
> Don't forget to close connection inside `afterAll`

```typescript
import { getConnection } from 'typeorm';
import { connect } from '@milksub/milkbox-db-utils/testConnection';
import { Subscription } from '../src/models/Subscription';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  getConnection().close();
});

it('Test subscriptions are there', async () => {
  await Subscription.find();
});
```
