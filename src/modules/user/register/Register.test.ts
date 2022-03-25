import { Connection } from 'typeorm';
import faker from 'faker';
import { testConn } from '../../../test-utils/testConn';
import { gCall } from '../../../test-utils/gCall';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
const registerMutation = `mutation {
  register(
    data: {
      name: "${name}"
      email: "${faker.internet.email()}"
      password: "zx226480"
      repeatPassword: "zx226480"
    }
  ) {
    message
  }
}`;

describe('Register', () => {
  it('Create user', async () => {
    const response = await gCall({ source: registerMutation });

    expect(response).toMatchObject({
      data: {
        register: {
          message: `Hello, ${name}`,
        },
      },
    });
  });
});
