import { ApiProperty } from '@nestjs/swagger';

export class ReportCarDto {
  @ApiProperty()
  idCar!: number;

  @ApiProperty()
  percentWorkload!: number;
}

export class ReportDto {
  @ApiProperty()
  report!: ReportCarDto[];
}
