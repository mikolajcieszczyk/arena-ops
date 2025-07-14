import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID of the client making the booking',
    example: 1,
  })
  @IsNumber()
  clientId: number;

  @ApiProperty({
    description: 'ID of the court being booked',
    example: 1,
  })
  @IsNumber()
  courtId: number;

  @ApiProperty({
    description: 'Start time of the booking (ISO 8601 format)',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the booking (ISO 8601 format)',
    example: '2024-01-15T12:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    description: 'Status of the booking',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
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
