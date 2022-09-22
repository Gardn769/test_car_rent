import { ApiProperty } from '@nestjs/swagger';

export class RentDto {
  @ApiProperty()
  idCar!: number;

  @ApiProperty()
  idClient!: number;

  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiProperty({ type: Date })
  endDate!: Date;
}
