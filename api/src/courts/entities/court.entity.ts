import { CourtSurface, CourtType } from '../dto/create-court.dto';

export class Court {
  id: number;
  name: string;
  description?: string;
  surface: CourtSurface;
  type: CourtType;
  courtNumber: number;
  isAvailable?: boolean;
  hourlyRate?: number;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
