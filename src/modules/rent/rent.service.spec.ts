import { RentDateDto } from './dto/rent.dto';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RentService } from './rent.service';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DateTime } from 'luxon';
import { ConflictException } from '@nestjs/common';
import { RentDto } from './dto/rent.dto';
import { ReportDto } from './dto/report.dto';
import { connect } from 'src/config/connections';
import { tariffs } from 'src/config/tariffs';
import { configurateDB } from 'src/config/configurate-db';

describe('rent', () => {
  let rentService: RentService;
  let db: DatabaseService;
  let config: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RentService,
        {
          provide: ConfigService,
          useValue: {
            //xz как конфиг по нормальному подрубить
            getOrThrow() {
              return { baseRate: 1000, discount: 0.05 };
            },
          },
        },
        {
          provide: DatabaseService,
          useValue: { query() {} },
        },
      ],
      // imports: [
      //   ConfigModule.forRoot({
      //     load: [configurateDB, connect, tariffs],
      //     envFilePath: '.env',
      //     isGlobal: true,
      //   }),
      // ],
    }).compile();
    db = moduleRef.get(DatabaseService);
    config = moduleRef.get(ConfigService);
    rentService = moduleRef.get(RentService);
  });

  describe('checkCar', () => {
    // const idCar: number = 1;
    const rent: RentDto = {
      idCar: 0,
      idClient: 0,
      costCarRent: 0,
      startDate: DateTime.local(2022, 9, 14).toISO(),
      endDate: DateTime.local(2022, 9, 16).toISO(),
    };
    it('rowCount = 0', async () => {
      // @ts-ignore
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
      const exp: boolean = await rentService.checkCar(rent);
      expect(exp).toBe(true);
    });

    it('days < 3', async () => {
      const end_date = DateTime.now().minus({ days: 2 }).toJSDate();
      const rows = [{ end_date }];
      // @ts-ignore
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows });
      const exp: boolean = await rentService.checkCar(rent);
      expect(exp).toBe(false);
    });

    it('days > 3', async () => {
      const end_date = DateTime.now().minus({ days: 4 }).toJSDate();
      const rows = [{ end_date }];
      // @ts-ignore
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows });
      const exp: boolean = await rentService.checkCar(rent);
      expect(exp).toBe(true);
    });

    it('car is busy now', async () => {
      const date = DateTime.now().plus({ days: 1 }).toJSDate();
      const rows = [{ end_date: date }];
      // @ts-ignore
      jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows });
      const exp: boolean = await rentService.checkCar(rent);
      expect(exp).toBe(false);
    });
  });

  describe('checkCostRent', () => {
    it('start_date.weekday > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 10).toISO(),
        endDate: DateTime.local(2022, 9, 17).toISO(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Начало аренды не может быть в выходной!'),
      );
    });
    it('end_date.weekday > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 7).toISO(),
        endDate: DateTime.local(2022, 9, 11).toISO(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Окончание аренды не может быть в выходной!'),
      );
    });
    it('days > 30', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toISO(),
        endDate: DateTime.local(2022, 10, 7).toISO(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Аренду можно брать максимум на 30 дней'),
      );
    });

    it('days > 17', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toISO(),
        endDate: DateTime.local(2022, 9, 20).toISO(),
      };
      expect(rentService.checkCostRent(rent)).toBe(18500);
    });

    it('days > 10', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toISO(),
        endDate: DateTime.local(2022, 9, 16).toISO(),
      };
      expect(rentService.checkCostRent(rent)).toBe(15050);
    });

    it('days > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 15).toISO(),
        endDate: DateTime.local(2022, 9, 23).toISO(),
      };
      expect(rentService.checkCostRent(rent)).toBe(8750);
    });

    it('days < 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 14).toISO(),
        endDate: DateTime.local(2022, 9, 16).toISO(),
      };
      expect(rentService.checkCostRent(rent)).toBe(3000);
    });
  });

  describe('rentCar', () => {
    it('start_date.weekday > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 10).toISO(),
        endDate: DateTime.local(2022, 9, 17).toISO(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Начало аренды не может быть в выходной!'),
      );
    });
    it('end_date.weekday > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 7).toISO(),
        endDate: DateTime.local(2022, 9, 11).toISO(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Окончание аренды не может быть в выходной!'),
      );
    });
    it('days > 30', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toISO(),
        endDate: DateTime.local(2022, 10, 7).toISO(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Аренду можно брать максимум на 30 дней'),
      );
    });
  });

  describe('report', () => {
    const rent: RentDateDto = {
      startDate: DateTime.local(2022, 9, 14).toISO(),
      endDate: DateTime.local(2022, 10, 16).toISO(),
    };
    it('test work', async () => {
      const rows = [
        {
          car_id: 1,
          start_date: DateTime.now().minus({ day: 15 }).toJSDate(),
          end_date: DateTime.now().minus({ day: 3 }).toJSDate(),
        },
        // {
        //   idCar: 1,
        //   start_date: DateTime.now().minus({ day: 20 }).toJSDate(),
        //   end_date: DateTime.now().minus({ day: 17 }).toJSDate(),
        // },
        {
          car_id: 2,
          start_date: DateTime.now().minus({ day: 10 }).toJSDate(),
          end_date: DateTime.now().minus({ day: 7 }).toJSDate(),
        },
      ];
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 10).toISO(),
        endDate: DateTime.local(2022, 10, 10).toISO(),
      };
      // @ts-ignore
      jest.spyOn(db, 'query').mockResolvedValue({ rows });
      const exp: ReportDto = await rentService.report(rent);
      expect(exp).toStrictEqual(<ReportDto>{
        report: [
          {
            idCar: 1,
            percentWorkload: 0.4,
          },
          {
            idCar: 2,
            percentWorkload: 0.1,
          },
        ],
        averegeLoad: 0.25,
      });
    });

    it('null result', async () => {
      // @ts-ignore
      jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
      const exp: ReportDto = await rentService.report(rent);
      expect(exp).toStrictEqual(<ReportDto>{ report: [], averegeLoad: 0 });
    });
  });
});
