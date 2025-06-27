import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional, IsNumber, IsString } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
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
