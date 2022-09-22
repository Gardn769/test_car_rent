import { env } from 'process';

export const connect = () => ({
  connect: {
    host: env.DB_HOST || 'localhost',
    port: Number(env.SERVER_PORT) || 3300,
  },
});
