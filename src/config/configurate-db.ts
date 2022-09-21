import { env } from 'process';

export const configurateDB = {
  //   type: 'mysql',
  host: env.DB_HOST || 'localhost',
  port: Number(env.DB_PORT) || 3306,
  username: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'root',
  database: env.DB_NAME || 'ros_test',
};
