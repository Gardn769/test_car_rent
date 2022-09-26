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

  async checkCar(rent: RentDto): Promise<boolean> {
    console.log(rent);

    const { rows, rowCount } = await this.db.query(
      'SELECT end_date FROM car_rent WHERE car_id = $1 AND start_date <= $2 AND end_date >= $3 ORDER BY end_date DESC LIMIT 1',
      [String(rent.idCar), String(rent.endDate), String(rent.startDate)],
    );
    console.log(rows);
    console.log(rowCount);

    if (!rowCount) {
      return true;
    }

    const end_date: DateTime = DateTime.fromJSDate(rows[0].end_date);
    const days = DateTime.now().diff(end_date, 'days').toObject().days;
    return days > 3;
  }

  checkCostRent(dateRent: RentDateDto): number {
    const start_date: DateTime = DateTime.fromISO(dateRent.startDate);
    console.log(dateRent.startDate);
    console.log(start_date);

    const end_date: DateTime = DateTime.fromISO(dateRent.endDate);
    if (start_date.toLocal().weekday > 5) {
      throw new ConflictException('Начало аренды не может быть в выходной!');
    }
    if (end_date.toLocal().weekday > 5) {
      throw new ConflictException('Окончание аренды не может быть в выходной!');
    }

    let { days } = end_date.diff(start_date, 'days').toObject();
    console.log(days);
    days++;

    if (days > 30) {
      throw new ConflictException('Аренду можно брать максимум на 30 дней');
    }

    const tariffs = this.config.getOrThrow('tariffs');
    console.log(tariffs);
    console.log(tariffs.discount);

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

  async rentCar(rent: RentDto): Promise<boolean> {
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
    return true;
  }

  async report(rent: RentDateDto): Promise<ReportDto> {
    //     SELECT * FROM car_rent
    // where start_date <= '2022-09-23' and end_date >= '2022-09-14'
    const { rows } = await this.db.query(
      'SELECT * FROM car_rent WHERE start_date <= $1  AND end_date >=  $2',
      [rent.endDate, rent.startDate],
    );
    const start_pereiod: DateTime = DateTime.fromISO(rent.startDate);
    const end_pereiod: DateTime = DateTime.fromISO(rent.endDate);

    console.log(rows);

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

    const daysPereiod = end_pereiod.diff(start_pereiod, 'days').toObject().days;
    const report: ReportCarDto[] = [];
    for (const reportKey in workload) {
      report.push({
        idCar: +reportKey,
        percentWorkload: +(workload[reportKey] / daysPereiod).toFixed(2),
      });
    }
    console.log(report);

    let averegeLoad = 0;
    for (const i in report) {
      averegeLoad += report[i].percentWorkload;
    }
    if (report.length !== 0) {
      averegeLoad /= report.length;
    }

    return <ReportDto>{ report, averegeLoad };
  }
}
