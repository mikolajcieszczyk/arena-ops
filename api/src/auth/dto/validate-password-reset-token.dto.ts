import { IsString } from 'class-validator';

export class ValidatePasswordResetTokenDto {
  @IsString()
  token: string;
}
