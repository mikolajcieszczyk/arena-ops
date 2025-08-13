import { IsNumber } from 'class-validator';

export class RevokeAllSessionsDto {
  @IsNumber()
  userId: number;
}
