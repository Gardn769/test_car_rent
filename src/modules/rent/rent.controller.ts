import { ReportDto } from './dto/report.dto';
import { RentDto } from './dto/rent.dto';
import { RentService } from './rent.service';
import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('rent')
@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @ApiOperation({ summary: 'Проверка доступен ли автомобиль' })
  @Get('checkCar')
  checkCar(): void {
    // return this.rentService.checkCar(2);
  }

  @ApiOperation({
    summary: 'Производится расчёт стоимости аренды автомобиля за период',
  })
  @Get('checkCostRent/:days')
  @ApiParam({ name: 'days', type: number })
  async checkCostRent(@Param('days') days: number): Promise<number> {
    return await this.rentService.checkCostRent(3);
  }

  @ApiOperation({ summary: 'Создание сессии аренды автомобиля' })
  @Post('rentCar')
  rentCar(@Body() rent: RentDto): void {
    // this.rentService.rentCar();
  }

  @ApiOperation({
    summary:
      'Формируется отчёт средней загрузки автомобилей за месяц, по каждому авто и итогом по всем автомобилям. ',
  })
  @Get('report')
  async report(): Promise<ReportDto> {
    return await this.rentService.report();
  }
}
