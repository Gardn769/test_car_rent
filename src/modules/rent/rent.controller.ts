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
  @Post('checkCar')
  checkCar(@Body() rent: RentDto): Promise<boolean> {
    return this.rentService.checkCar(rent);
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
  async rentCar(@Body() rent: RentDto): Promise<boolean> {
    return await this.rentService.rentCar(rent);
  }

  @ApiOperation({
    summary:
      'Формируется отчёт средней загрузки автомобилей за месяц, по каждому авто и итогом по всем автомобилям. ',
  })
  @Post('report')
  async report(@Body() rent: RentDateDto): Promise<ReportDto> {
    return await this.rentService.report(rent);
  }
}
