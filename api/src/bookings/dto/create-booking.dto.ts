import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export class CreateBookingDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  courtId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  specialRequests?: string;
}
