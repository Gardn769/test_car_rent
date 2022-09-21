import { configurateDB } from './../config/configurate-db';
import { Pool } from 'pg';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  pool = new Pool({
    user: configurateDB.username,
    host: configurateDB.host,
    database: configurateDB.database,
    password: configurateDB.password,
    port: configurateDB.port,
  });

  // query(text, params?, callback) {
  //   return this.pool.query(text, params, callback);
  // }
  query(text, params?) {
    return this.pool.query(text, params);
  }

  createTable() {
    const createTableText = `CREATE  TABLE CAR_RENT IF NOT EXISTS users (  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), );`;
    this.query(createTableText);
  }
}
