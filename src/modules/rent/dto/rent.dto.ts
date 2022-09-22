import { ApiProperty } from '@nestjs/swagger';
export class RentDateDto {
  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiProperty({ type: Date })
  endDate!: Date;
}

export class RentDto {
  @ApiProperty()
  idCar!: number;

  @ApiProperty()
  idClient!: number;

  @ApiProperty()
  costCarRent!: number;

  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiProperty({ type: Date })
  endDate!: Date;
}
