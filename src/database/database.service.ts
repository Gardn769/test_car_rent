import { configurateDB } from './../config/configurate-db';
import { Pool, QueryResult } from 'pg';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private pool: Pool;
  constructor(private config: ConfigService) {
    const configurateDB = this.config.getOrThrow('database');
    this.pool = new Pool({
      user: configurateDB.username,
      host: configurateDB.host,
      database: configurateDB.database,
      password: configurateDB.password,
      port: configurateDB.port,
    });
  }

  query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }
  // query(text, params?, callback) {
  //   return this.pool.query(text, params, callback);
  // }
  // query(text, params?) {
  //   return this.pool.query(text, params);
  // }

  createTable() {
    const createTableText = `CREATE TABLE CAR_RENT IF NOT EXISTS users (  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), );`;
    this.query(createTableText);
  }
}
