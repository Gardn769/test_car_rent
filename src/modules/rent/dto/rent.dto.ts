import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNumber } from 'class-validator';
export class RentDateDto {
  @ApiProperty()
  @Type()
  @IsDateString()
  startDate!: string;

  @ApiProperty()
  @Type()
  @IsDateString()
  endDate!: string;
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

  @ApiProperty()
  @IsDateString()
  startDate!: string;

  @ApiProperty()
  @IsDateString()
  endDate!: string;
}
