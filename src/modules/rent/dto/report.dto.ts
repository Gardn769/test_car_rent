import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportCarDto {
  @ApiProperty()
  @IsNumber()
  idCar!: number;

  @ApiProperty()
  @IsNumber()
  percentWorkload!: number;
}

export class ReportDto {
  @ApiProperty()
  report!: ReportCarDto[];

  @ApiProperty()
  averegeLoad!: number;
}
