import { DatabaseService } from './../../database/database.service';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DateTime, Duration } from 'luxon';

@Injectable()
export class RentService {
  constructor(private db: DatabaseService) {}

  async checkCar(id: number): Promise<string> {
    await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
    //   return this.appService.getHello();
    console.log(DateTime.now().toString());
    let dt = DateTime.now();

    console.log(dt.day);
    dt.plus(Duration.fromObject({ days: 20, hours: 2, minutes: 7 }));
    console.log(dt);
    return DateTime.now().toString();
  }

  checkCostRent(): void {
    //   return this.appService.getHello();
    let gg = 10;
    let costRent = 0;
    if (gg >= 4) {
      gg -= 4;
      costRent += 4 * 1000;
    } else {
      costRent += gg * 1000;
      gg = 0;
    }

    if (gg >= 5) {
      gg -= 5;
      costRent += 5 * 1000;
    } else {
      costRent += gg * 1000;
      gg = 0;
    }
    if (gg >= 6) {
      gg -= 6;
      costRent += 6 * 1000;
    } else {
      costRent += gg * 1000;
      gg = 0;
    }
    if (gg >= 8) {
      gg -= 8;
      costRent += 8 * 1000;
    } else {
      costRent += gg * 1000;
      gg = 0;
    }
  }

  rentCar(): void {
    //   return this.appService.getHello();
  }

  report(): void {
    //   return this.appService.getHello();
  }
}
