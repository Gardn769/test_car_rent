import { RentDto } from './dto/rent.dto';
import { DatabaseService } from './../../database/database.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DateTime } from 'luxon';

@Injectable()
export class RentService {
  constructor(private db: DatabaseService) {}

  async checkCar(idCar: number): Promise<boolean> {
    const { rows } = await this.db.query(
      'SELECT end_date FROM car_rent WHERE car_id = $1 ORDER BY end_date DESC LIMIT 1',
      [String(idCar)],
    );
    // let dt = DateTime.now();
    // // const end_date: DateTime = DateTime.fromISO(rows[0].end_date)
    // // const { days } = end_date.diffNow('day').toObject()

    // const end_date: DateTime = dt.plus({ days: 20 });
    // console.log(end_date.diffNow('day').toObject());

    // console.log(dt.day);
    // // dt.plus(Duration.fromObject({ days: 20, hours: 2, minutes: 7 }));
    // dt = dt.plus({ days: 1 });
    // console.log(dt.plus({ days: 1 }));
    // console.log(dt.day);
    // // return DateTime.now().toString();

    // const end_date: DateTime = DateTime.fromISO(rows[0].end_date);
    // const { days } = end_date.diffNow('day').toObject();

    // return Number(days) > 3;
    return Number(2) > 3;
  }

  checkCostRent(startDate: Date, endDate: Date): void {
    //   return this.appService.getHello();
    if (startDate.getDay() > 5) {
      throw new ConflictException('Начало аренды в выходной!');
    }
    if (endDate.getDay() > 5) {
      throw new ConflictException('Окончание аренды в выходной!');
    }
    let daysRent = endDate.getDay() - startDate.getDay();
    if (daysRent > 30) {
      throw new ConflictException('аренду можно брать только на 30 дней');
    }
    let costRent = 0;
    if (daysRent >= 4) {
      daysRent -= 4;
      costRent += 4 * 1000;
    } else {
      costRent += daysRent * 1000;
      daysRent = 0;
    }

    if (daysRent >= 5) {
      daysRent -= 5;
      costRent += 5 * 1000;
    } else {
      costRent += daysRent * 1000;
      daysRent = 0;
    }
    if (daysRent >= 6) {
      daysRent -= 6;
      costRent += 6 * 1000;
    } else {
      costRent += daysRent * 1000;
      daysRent = 0;
    }
    if (daysRent >= 8) {
      daysRent -= 8;
      costRent += 8 * 1000;
    } else {
      costRent += daysRent * 1000;
      daysRent = 0;
    }
  }

  async rentCar(rent: RentDto): Promise<void> {
    if (rent.startDate.getDay() > 5) {
      throw new ConflictException('Начало аренды в выходной!');
    }
    if (rent.endDate.getDay() > 5) {
      throw new ConflictException('Окончание аренды в выходной!');
    }
    if (rent.endDate.getDay() - rent.startDate.getDay() > 30) {
      throw new ConflictException('аренду можно брать только на 30 дней');
    }
    //   await this.db.query(
    //     'INSERT INTO car_rentals (car_id, client_id, start_date, end_date) VALUES ($1, $2, $3, $4)',
    //     [rent.idCar, rent.idClient, rent.startDate, rent.endDate],
    //   );
  }

  report(): void {
    //   return this.appService.getHello();
    const i1 = DateTime.fromISO('1982-05-25T09:45'),
      i2 = DateTime.fromISO('1983-10-14T10:30');
    // i2.diff(i1).toObject(); //=> { milliseconds: 43807500000 }
    // i2.diff(i1, 'hours').toObject(); //=> { hours: 12168.75 }
    console.log(i1.diff(i2, 'days').toObject()); //=> { hours: 12168.75 }
    // i2.diff(i1, ['months', 'days']).toObject(); //=> { months: 16, days: 19.03125 }
    // i2.diff(i1, ['months', 'days', 'hours']).toObject(); //=> { months: 16, days: 19, hours: 0.75 }
  }
}

// constructor(
//   private db: DatabaseService,
//   private config: ConfigService,
// ) {}

// async checkCar(idCar: number): Promise<boolean> {
//   const { rows } = await this.db.query(
//     'SELECT end_date FROM car_rentals WHERE car_id = $1 ORDER BY end_date DESC LIMIT 1',
//     [String(idCar)],
//   );

//   const end_date: DateTime = DateTime.fromISO(rows[0].end_date)
//   const { days } = end_date.diffNow('day').toObject()

//   return Number(days) > 3

// }

// cost(days: number): number {
//   const defPrice: number = this.config.getOrThrow('rentPrice');
//   if (days > 18) {
//     days -= 15;
//     return defPrice * 4 +
//       (defPrice - defPrice * 0.05) * 5 +
//       (defPrice - defPrice * 0.10) * 6 +
//       (defPrice - defPrice * 0.15) * days;
//   }
//   if (days > 10) {
//     days -= 9;
//     return defPrice * 4 +
//       (defPrice - defPrice * 0.05) * 5 +
//       (defPrice - defPrice * 0.10) * days;
//   }
//   if (days > 5) {
//     days -= 4;
//     return defPrice * 4 +
//       (defPrice - defPrice * 0.05) * days;
//   }
//   return defPrice * days;
// }

// async rentCar(rent: RentDto): Promise<void> {
//   if (rent.startDate.getDay() > 5) {
//     throw new ConflictException('Начало аренды в выходной!');
//   }
//   if (rent.endDate.getDay() > 5) {
//     throw new ConflictException('Окончание аренды в выходной!');
//   }

//   await this.db.query(
//     'INSERT INTO car_rentals (car_id, client_id, start_date, end_date) VALUES ($1, $2, $3, $4)',
//     [rent.idCar, rent.idClient, rent.startDate, rent.endDate],
//   );
// }

// async averageLoadReport(): Promise<ReportDto> {
//   const { rows } = await this.db.query(
//     'SELECT car_id, COUNT(*) AS rentCount FROM car_rentals GROUP BY car_id',
//   );
//   return <ReportDto><unknown>rows;
// }
