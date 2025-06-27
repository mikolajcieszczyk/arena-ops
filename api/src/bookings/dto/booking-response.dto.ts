import { BookingStatus } from './create-booking.dto';
import { ClientResponseDto } from '../../clients/dto/client-response.dto';
import { CourtResponseDto } from '../../courts/dto/court-response.dto';

export class BookingResponseDto {
  id: number;
  clientId: number;
  courtId: number;
  client?: ClientResponseDto;
  court?: CourtResponseDto;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  totalPrice?: number;
  notes?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}
