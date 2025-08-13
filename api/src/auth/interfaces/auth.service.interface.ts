import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { PasswordResetRequestResponse } from '../types/password-reset.types';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<void>;
  validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null>;
  login(loginDto: LoginDto): Promise<{ accessToken: string }>;
  requestPasswordReset(email: string): Promise<PasswordResetRequestResponse>;
  validatePasswordResetToken(token: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
