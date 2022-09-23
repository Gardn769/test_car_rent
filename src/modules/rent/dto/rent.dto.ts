import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNumber } from 'class-validator';
export class RentDateDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}

export class RentDto {
  @ApiProperty()
  @IsNumber()
  idCar!: number;

  @ApiProperty()
  @IsNumber()
  idClient!: number;

  @ApiProperty()
  @IsNumber()
  costCarRent!: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  startDate!: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  endDate!: Date;
}
