import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsString,
  Min,
} from 'class-validator';
import { BookingStatus } from './create-booking.dto';

export class UpdateBookingDto {
  @ApiPropertyOptional({
    description: 'ID of the client making the booking',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @ApiPropertyOptional({
    description: 'ID of the court being booked',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  courtId?: number;

  @ApiPropertyOptional({
    description: 'Start time of the booking (ISO 8601 format)',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time of the booking (ISO 8601 format)',
    example: '2024-01-15T12:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Status of the booking',
    enum: BookingStatus,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({
    description: 'Total price of the booking',
    example: 50.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Additional notes for the booking',
    example: 'Please bring your own racket',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Special requests for the booking',
    example: 'Need extra balls',
  })
  @IsString()
  @IsOptional()
  specialRequests?: string;
}
