import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `CREATE TABLE IF NOT EXISTS car_rent (
            id SERIAL PRIMARY KEY,
            car_id INTEGER,
            client_id INTEGER,
            start_date DATE,
            end_date DATE
            )`,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE car_rent`);
}
