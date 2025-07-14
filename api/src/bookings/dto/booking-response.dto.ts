import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from './create-booking.dto';

export class BookingResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the booking',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the client making the booking',
    example: 1,
  })
  clientId: number;

  @ApiProperty({
    description: 'ID of the court being booked',
    example: 1,
  })
  courtId: number;

  @ApiProperty({
    description: 'Start time of the booking',
    example: '2024-01-15T10:00:00Z',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the booking',
    example: '2024-01-15T12:00:00Z',
  })
  endTime: string;

  @ApiProperty({
    description: 'Status of the booking',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @ApiPropertyOptional({
    description: 'Total price of the booking',
    example: 50.0,
  })
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Additional notes for the booking',
    example: 'Please bring your own racket',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Special requests for the booking',
    example: 'Need extra balls',
  })
  specialRequests?: string;

  @ApiProperty({
    description: 'Date when the booking was created',
    example: '2024-01-10T08:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date when the booking was last updated',
    example: '2024-01-10T08:00:00Z',
  })
  updatedAt: string;
}
