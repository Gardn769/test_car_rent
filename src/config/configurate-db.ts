import { env } from 'process';

export const configurateDB = () => ({
  database: {
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT) || 5432,
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    // database: 'car_rent',
  },
});
