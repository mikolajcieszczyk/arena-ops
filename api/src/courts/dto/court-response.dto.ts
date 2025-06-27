import { CourtSurface, CourtType } from './create-court.dto';

export class CourtResponseDto {
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
