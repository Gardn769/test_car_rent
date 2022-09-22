import { ApiProperty } from '@nestjs/swagger';

export class RentDto {
  @ApiProperty()
  idCar!: number;
  @ApiProperty()
  idClient!: number;
  @ApiProperty()
  startDate!: Date;
  @ApiProperty()
  endDate!: Date;
}
