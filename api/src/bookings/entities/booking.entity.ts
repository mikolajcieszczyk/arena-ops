import { BookingStatus } from '../dto/create-booking.dto';
import { Client } from '../../clients/entities/client.entity';
import { Court } from '../../courts/entities/court.entity';

export class Booking {
  id: number;
  clientId: number;
  courtId: number;
  client?: Client;
  court?: Court;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  totalPrice?: number;
  notes?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}
