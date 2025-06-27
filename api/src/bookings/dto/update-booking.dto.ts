import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional, IsNumber, IsString } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsDateString()
  @IsOptional()
  lastUpdate?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
