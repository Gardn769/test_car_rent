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

    return Number(2) > 3;
  }

  checkCostRent(dateRent: RentDateDto): number {
    const start_date: DateTime = DateTime.fromISO(String(dateRent.startDate));
    const end_date: DateTime = DateTime.fromISO(String(dateRent.endDate));
    if (start_date.toLocal().weekday > 5) {
      throw new ConflictException('Начало аренды не может быть в выходной!');
    }
    if (end_date.toLocal().weekday > 5) {
      throw new ConflictException('Окончание аренды не может быть в выходной!');
    }

    let { days } = end_date.diff(start_date, 'days').toObject();

    if (days > 30) {
      throw new ConflictException('аренду можно брать только на 30 дней');
    }

    const tariffs = this.config.getOrThrow('tariffs');
    if (days > 17) {
      days -= 17;
      return (
        tariffs.baseRate * 4 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount) * 5 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount * 2) * 8 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount * 3) * days
      );
    }
    if (days > 10) {
      days -= 9;
      return (
        tariffs.baseRate * 4 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount) * 5 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount * 2) * days
      );
    }
    if (days > 5) {
      days -= 4;
      return (
        tariffs.baseRate * 4 +
        (tariffs.baseRate - tariffs.baseRate * tariffs.discount) * days
      );
    }
    return tariffs.baseRate * days;
  }

  async rentCar(rent: RentDto): Promise<void> {
    const start_date: DateTime = DateTime.fromISO(String(rent.startDate));
    const end_date: DateTime = DateTime.fromISO(String(rent.endDate));
    if (start_date.toLocal().weekday > 5) {
      throw new ConflictException('Начало аренды не может быть в выходной!');
    }
    if (end_date.toLocal().weekday > 5) {
      throw new ConflictException('Окончание аренды не может быть в выходной!');
    }

    const { days } = end_date.diff(start_date, 'days').toObject();

    if (days > 30) {
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
    const { rows } = await this.db.query(
      'SELECT * FROM car_rent WHERE start_date >  CURRENT_DATE - 30',
    );
    // const { rows } = await this.db.query(`
    //   SELECT car_id, SUM(count_days)
    //   as count
    //   FROM CarRent
    //   WHERE date_to BETWEEN '${lastDate}'::DATE + INTERVAL '-1 month' AND '${lastDate}'::DATE AND
    //         date_from BETWEEN '${lastDate}'::DATE + INTERVAL '-1 month' AND '${lastDate}'::DATE
    //   GROUP BY car_id`);

    const workload: any = {};
    for (const row of rows) {
      const start_date: DateTime = DateTime.fromISO(row.start_date);
      const end_date: DateTime = DateTime.fromISO(row.end_date);

      const { days } = end_date.diff(start_date, 'days').toObject();
      if (!workload[row.car_id]) {
        workload[row.car_id] = 0;
      }
      workload[row.car_id] += Number(days);
    }

    const report: ReportCarDto[] = [];
    for (const reportKey in workload) {
      report.push({
        idCar: +reportKey,
        percentWorkload: +(workload[reportKey] / 30).toFixed(2),
      });
    }

    return <ReportDto>{ report };
  }
}
