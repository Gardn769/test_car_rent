import { RentService } from './rent.service';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('rent')
@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @ApiOperation({ summary: 'Проверка доступен ли автомобиль' })
  @Get('checkCar')
  checkCar(): Promise<string> {
    return this.rentService.checkCar(2);
  }

  @ApiOperation({
    summary: 'Производится расчёт стоимости аренды автомобиля за период',
  })
  @Get('checkCostRent')
  checkCostRent(): void {
    this.rentService.checkCostRent();
  }

  @ApiOperation({ summary: 'Создание сессии аренды автомобиля' })
  @Post('rentCar')
  rentCar(): void {
    this.rentService.rentCar();
  }

  @ApiOperation({
    summary:
      'Формируется отчёт средней загрузки автомобилей за месяц, по каждому авто и итогом по всем автомобилям. ',
  })
  @Get('report')
  report(): void {
    this.rentService.checkCostRent();
  }
}
