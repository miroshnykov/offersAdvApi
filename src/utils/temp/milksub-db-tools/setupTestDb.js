// eslint-disable-next-line import/no-extraneous-dependencies
require('ts-node').register({ transpileOnly: true });
require('dotenv').config();

// eslint-disable-next-line import/no-unresolved
const { dbSetup } = require('@milksub/milkbox-db-utils/dbSetup');

module.exports = async () => dbSetup();
