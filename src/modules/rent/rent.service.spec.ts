import { RentDateDto } from './dto/rent.dto';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RentService } from './rent.service';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { ConflictException } from '@nestjs/common';
import { RentDto } from './dto/rent.dto';
import { ReportDto } from './dto/report.dto';

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
            // WARNING! всегда кидаю 1000, потому что только она нужна в тестах
            getOrThrow() {
              return 1000;
            },
          },
        },
        {
          provide: DatabaseService,
          useValue: { query() {} },
        },
      ],
    }).compile();
    db = moduleRef.get(DatabaseService);
    config = moduleRef.get(ConfigService);
    rentService = moduleRef.get(RentService);
  });

  // describe('checkCar', () => {
  //   const idCar: number = 1;

  //   it('rowCount = 0', async () => {
  //     // @ts-ignore
  //     jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 0 });
  //     const exp: boolean = await rentService.checkCar(idCar);
  //     expect(exp).toBe(true);
  //   });

  //   it('days < 3', async () => {
  //     const end_date = DateTime.now().minus({ days: 2 }).toJSDate();
  //     const rows = [{ end_date }];
  //     // @ts-ignore
  //     jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows });
  //     const exp: boolean = await rentService.checkCar(idCar);
  //     expect(exp).toBe(false);
  //   });

  //   it('days > 3', async () => {
  //     const end_date = DateTime.now().minus({ days: 4 }).toJSDate();
  //     const rows = [{ end_date }];
  //     // @ts-ignore
  //     jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows });
  //     const exp: boolean = await rentService.checkCar(idCar);
  //     expect(exp).toBe(true);
  //   });

  //   it('car is busy now', async () => {
  //     const date = DateTime.now().plus({ days: 1 }).toJSDate();
  //     const rows = [{ end_date: date }];
  //     // @ts-ignore
  //     jest.spyOn(db, 'query').mockResolvedValue({ rowCount: 1, rows });
  //     const exp: boolean = await rentService.checkCar(idCar);
  //     expect(exp).toBe(false);
  //   });
  // });

  describe('checkCostRent', () => {
    it('start_date.weekday > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 10).toJSDate(),
        endDate: DateTime.local(2022, 9, 17).toJSDate(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Начало аренды не может быть в выходной!'),
      );
    });
    it('end_date.weekday > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 7).toJSDate(),
        endDate: DateTime.local(2022, 9, 11).toJSDate(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Окончание аренды не может быть в выходной!'),
      );
    });
    it('days > 30', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toJSDate(),
        endDate: DateTime.local(2022, 10, 7).toJSDate(),
      };

      expect(() => rentService.checkCostRent(rent)).toThrowError(
        new ConflictException('Аренду можно брать максимум на 30 дней'),
      );
    });

    it('days > 17', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toJSDate(),
        endDate: DateTime.local(2022, 9, 20).toJSDate(),
      };
      expect(rentService.checkCostRent(rent)).toBe(18500);
    });

    it('days > 10', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 1).toJSDate(),
        endDate: DateTime.local(2022, 9, 17).toJSDate(),
      };
      expect(rentService.checkCostRent(rent)).toBe(15950);
    });

    it('days > 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 15).toJSDate(),
        endDate: DateTime.local(2022, 9, 23).toJSDate(),
      };
      expect(rentService.checkCostRent(rent)).toBe(7800);
    });

    it('days < 5', () => {
      const rent: RentDateDto = {
        startDate: DateTime.local(2022, 9, 14).toJSDate(),
        endDate: DateTime.local(2022, 9, 16).toJSDate(),
      };
      expect(rentService.checkCostRent(rent)).toBe(3000);
    });
  });

  // describe('rentCar', () => {
  //   it('start weekday > 5', () => {
  //     const rent: Partial<RentDto> = {
  //       startDate: DateTime.local(2022, 9, 17).toJSDate(),
  //     };
  //     expect(
  //       async () => await rentService.rentCar(<RentDto>rent),
  //     ).rejects.toThrowError(
  //       new ConflictException('Начало аренды в выходной!'),
  //     );
  //   });

  //   it('end weekday > 5', () => {
  //     const rent: Partial<RentDto> = {
  //       startDate: DateTime.local(2022, 9, 15).toJSDate(),
  //       endDate: DateTime.local(2022, 9, 17).toJSDate(),
  //     };
  //     expect(
  //       async () => await rentService.rentCar(<RentDto>rent),
  //     ).rejects.toThrowError(
  //       new ConflictException('Окончание аренды в выходной!'),
  //     );
  //   });

  //   it('rent day > 30', () => {
  //     const rent: Partial<RentDto> = {
  //       startDate: DateTime.local(2022, 8, 1).toJSDate(),
  //       endDate: DateTime.local(2022, 10, 3).toJSDate(),
  //     };
  //     expect(
  //       async () => await rentService.rentCar(<RentDto>rent),
  //     ).rejects.toThrowError(
  //       new ConflictException('Аренда более чем на 30 дней!'),
  //     );
  //   });
  // });

  // describe('averageLoadReport', () => {
  //   it('test work', async () => {
  //     const rows = [
  //       {
  //         car_id: 1,
  //         start_date: DateTime.now().minus({ day: 15 }).toJSDate(),
  //         end_date: DateTime.now().minus({ day: 3 }).toJSDate(),
  //       },
  //       {
  //         car_id: 1,
  //         start_date: DateTime.now().minus({ day: 20 }).toJSDate(),
  //         end_date: DateTime.now().minus({ day: 17 }).toJSDate(),
  //       },
  //       {
  //         car_id: 2,
  //         start_date: DateTime.now().minus({ day: 10 }).toJSDate(),
  //         end_date: DateTime.now().minus({ day: 7 }).toJSDate(),
  //       },
  //     ];
  //     // @ts-ignore
  //     jest.spyOn(db, 'query').mockResolvedValue({ rows });
  //     const exp: ReportDto = await rentService.averageLoadReport();
  //     expect(exp).toStrictEqual(<ReportDto>{
  //       report: [
  //         {
  //           carId: 1,
  //           percentWorkload: 0.5,
  //         },
  //         {
  //           carId: 2,
  //           percentWorkload: 0.1,
  //         },
  //       ],
  //     });
  //   });

  //   it('null result', async () => {
  //     // @ts-ignore
  //     jest.spyOn(db, 'query').mockResolvedValue({ rows: [] });
  //     const exp: ReportDto = await rentService.averageLoadReport();
  //     expect(exp).toStrictEqual(<ReportDto>{ report: [] });
  //   });
  // });
});
