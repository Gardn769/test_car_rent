import { ApiProperty } from '@nestjs/swagger';

class ReportCarDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  percentWorkload!: number;
}

export class ReportDto {
  @ApiProperty()
  report!: ReportCarDto[];
}
