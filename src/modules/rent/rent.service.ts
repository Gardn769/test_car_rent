import { tariffs } from './../../config/tariffs';
import { ConfigService } from '@nestjs/config';
import { ReportCarDto, ReportDto } from './dto/report.dto';
import { RentDto, RentDateDto } from './dto/rent.dto';
import { DatabaseService } from './../../database/database.service';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { DateTime } from 'luxon';

@Injectable()
export class RentService {
  private readonly logger = new Logger(RentService.name);

  constructor(private db: DatabaseService, private config: ConfigService) {}

  async checkCar(idCar: number): Promise<boolean> {
    const { rows, rowCount } = await this.db.query(
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

  checkCostRent(days: RentDateDto): number {
    // return this.appService.getHello();
    console.log(days.startDate);
    const startDate = Datetime.frodays.startDate;
    if (startDate.getDay() > 5) {
      throw new ConflictException('Начало аренды в выходной!');
    }
    if (days.endDate.getDay() > 5) {
      throw new ConflictException('Окончание аренды в выходной!');
    }
    let daysRent = days.endDate.getDay() - days.startDate.getDay();
    if (daysRent > 30) {
      throw new ConflictException('аренду можно брать только на 30 дней');
    }
    const tariffs = this.config.getOrThrow('tariffs');
    if (daysRent > 17) {
      daysRent -= 17;
      return (
        tariffs.baseRate * 4 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount) * 5 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount * 2) * 8 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount * 3) * daysRent
      );
    }
    if (daysRent > 10) {
      daysRent -= 9;
      return (
        tariffs.baseRate * 4 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount) * 5 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount * 2) * daysRent
      );
    }
    if (daysRent > 5) {
      daysRent -= 4;
      return (
        tariffs.baseRate * 4 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount) * daysRent
      );
    }
    return tariffs.baseRate * daysRent;
  }

  async rentCar(rent: RentDto): Promise<void> {
    const start_date: DateTime = DateTime.fromISO(rent.startDate);
    const end_date: DateTime = DateTime.fromISO(rent.endDate);

    if (rent.startDate.getDay() > 5) {
      throw new ConflictException('Начало аренды не может быть в выходной!');
    }
    if (rent.endDate.getDay() > 5) {
      throw new ConflictException('Окончание аренды не может быть в выходной!');
    }
    if (rent.endDate.getDay() - rent.startDate.getDay() > 30) {
      throw new ConflictException('аренду можно брать только на 30 дней');
    }
    await this.db.query(
      'INSERT INTO car_rent (car_id, client_id, start_date, end_date) VALUES ($1, $2, $3, $4)',
      [rent.idCar, rent.idClient, rent.startDate, rent.endDate],
    );
  }

  async report(): Promise<ReportDto> {
    // const i1 = DateTime.fromISO('1982-05-25T09:45');
    // const i2 = DateTime.fromISO('1983-10-14T10:30');
    // console.log(i1.diff(i2, 'days').toObject());
    // const { rows } = await this.db.query(
    //   'SELECT car_id, COUNT(*) AS rentCount FROM car_rentals GROUP BY car_id',
    // );
    // return <ReportDto>(<unknown>rows);
    // let { rows }: { rows: CarRentalsInterface[] } = await this.db.query(
    let { rows } = await this.db.query(
      "SELECT * FROM car_rentals WHERE start_date >  CURRENT_DATE - 30",
    );

    const workload: any = {};
    for (const row of rows) {
      const start_date: DateTime = DateTime.fromJSDate(row.start_date);
      const end_date: DateTime = DateTime.fromJSDate(row.end_date);

      const { days } = end_date.diff(start_date, 'days').toObject();
      if (!workload[row.car_id]) {
        workload[row.car_id] = 0;
      }
      workload[row.car_id] += Number(days);
    }

    const report: ReportCarDto[] = [];
    for (const reportKey in workload) {
      report.push({
        id: +reportKey,
        percentWorkload: +(workload[reportKey] / 30).toFixed(2),
      });
    }

    return <ReportDto>{ report };
  }
}
