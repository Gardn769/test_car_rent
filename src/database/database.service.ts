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
      user: configurateDB.user,
      host: configurateDB.host,
      password: configurateDB.password,
      port: configurateDB.port,
      database: configurateDB.database,
    });
  }

  query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }
}
