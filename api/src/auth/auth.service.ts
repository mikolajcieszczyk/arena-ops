import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { PasswordResetRequestResponse } from './types/password-reset.types';
import { IAuthService } from './interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });

      // Save user
      await this.userRepository.save(user);

      // Generate JWT token
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new InternalServerErrorException('Error during registration');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      // Update last login timestamp
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date(),
      });

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new InternalServerErrorException('Error during login');
    }
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async requestPasswordReset(
    email: string,
  ): Promise<PasswordResetRequestResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    try {
      // Generate token
      const token = this.generateToken();
      const salt = await bcrypt.genSalt();
      const hashedToken = await bcrypt.hash(token, salt);

      // Create password reset token
      const passwordResetToken = this.passwordResetTokenRepository.create({
        user,
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      });

      await this.passwordResetTokenRepository.save(passwordResetToken);

      return { token };
    } catch (_error) {
      throw new InternalServerErrorException(
        'Error during password reset request',
      );
    }
  }

  async validatePasswordResetToken(token: string): Promise<boolean> {
    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { used: false },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    if (!passwordResetToken) {
      return false;
    }

    if (passwordResetToken.expiresAt < new Date()) {
      return false;
    }

    return await bcrypt.compare(token, passwordResetToken.token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const passwordResetToken =
        await this.passwordResetTokenRepository.findOne({
          where: { used: false },
          relations: ['user'],
          order: { createdAt: 'DESC' },
        });

      if (!passwordResetToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      if (passwordResetToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      // Hash new password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      await this.userRepository.update(passwordResetToken.user.id, {
        password: hashedPassword,
      });

      // Mark token as used
      await this.passwordResetTokenRepository.update(passwordResetToken.id, {
        used: true,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during password reset');
    }
  }
}
