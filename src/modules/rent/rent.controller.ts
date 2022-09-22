import { ReportDto } from './dto/report.dto';
import { RentDto, RentDateDto } from './dto/rent.dto';
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
  @Post('checkCostRent')
  async checkCostRent(@Body() rent: RentDateDto): Promise<number> {
    return await this.rentService.checkCostRent(rent);
  }

  @ApiOperation({ summary: 'Создание сессии аренды автомобиля' })
  @Post('rentCar')
  rentCar(@Body() rent: RentDto): void {
    // this.rentService.rentCar(rent);
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
