import { Client } from 'pg';
import { configurateDB } from 'src/config/configurate-db';

export async function migration(): Promise<void> {
  const conf = configurateDB().database;

  const client = new Client({ ...conf });

  console.log(client);

  await client.connect();

  await client.query(
    'CREATE TABLE IF NOT EXISTS car_rent ( id SERIAL PRIMARY KEY, car_id INTEGER, client_id INTEGER, start_date DATE, end_date DATE )',
  );

  await client.end();
}
