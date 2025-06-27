import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional, IsNumber, IsString } from 'class-validator';
import { CreateCourtDto } from './create-court.dto';

export class UpdateCourtDto extends PartialType(CreateCourtDto) {
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
