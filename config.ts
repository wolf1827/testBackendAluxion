import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      connection: process.env.MONGO_CONNECTION,
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
      db_name: process.env.MONGO_DB,
    },
  };
});
