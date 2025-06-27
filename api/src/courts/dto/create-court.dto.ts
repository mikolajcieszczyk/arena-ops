import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export enum CourtSurface {
  HARD = 'hard',
  CLAY = 'clay',
  GRASS = 'grass',
  CARPET = 'carpet',
  ARTIFICIAL_GRASS = 'artificial_grass',
}

export enum CourtType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
}

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CourtSurface)
  surface: CourtSurface;

  @IsEnum(CourtType)
  type: CourtType;

  @IsNumber()
  @Min(1)
  @Max(100)
  courtNumber: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  hourlyRate?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
