import {Connection, getConnection, Logger} from 'typeorm';

class DummyLogger implements Logger {
  log(): any {
  }

  logMigration(): any {
  }

  logQuery(): any {
  }

  logQueryError(): any {
  }

  logQuerySlow(): any {
  }

  logSchemaBuild(): any {
  }
}

let origLogger: any;

export const enableDbLogging = (enable: boolean, connection?: Connection) => {
  const conn = connection || getConnection();
  if (enable && origLogger) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    conn.logger = origLogger;
    return;
  }

  origLogger = conn.logger;
  // @ts-ignore
  conn.logger = new DummyLogger();
};
