import {
  Controller,
  Post,
  Body,
  UseGuards,
  Ip,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IAuthService } from './interfaces/auth.service.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ValidatePasswordResetTokenDto } from './dto/validate-password-reset-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ISessionService,
  TokenResponse,
  SessionInfo,
} from './interfaces/session.service.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RevokeTokenDto } from './dto/revoke-token.dto';
import { RevokeAllSessionsDto } from './dto/revoke-all-sessions.dto';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  PasswordResetRequestResponse,
  PasswordResetValidationResponse,
} from './types/password-reset.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly sessionService: ISessionService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
  ): Promise<TokenResponse> {
    await this.authService.login(loginDto); // validate credentials
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sessionService.createSession(user, ip);
  }

  @Post('password-reset/request')
  @ApiOperation({ summary: 'Request password reset token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset token generated',
    schema: {
      properties: {
        token: {
          type: 'string',
          example: '1234567890abcdef...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid email' })
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<PasswordResetRequestResponse> {
    const result = await this.authService.requestPasswordReset(dto.email);
    return result;
  }

  @Post('password-reset/validate')
  @ApiOperation({ summary: 'Validate password reset token' })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    schema: {
      properties: {
        isValid: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  async validatePasswordResetToken(
    @Body() dto: ValidatePasswordResetTokenDto,
  ): Promise<PasswordResetValidationResponse> {
    const isValid = await this.authService.validatePasswordResetToken(
      dto.token,
    );
    return { isValid: Boolean(isValid) };
  }

  @Post('password-reset/reset')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New token pair generated',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: '1234567890abcdef...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(
    @Body() dto: RefreshTokenDto,
    @Ip() ip: string,
  ): Promise<TokenResponse> {
    return this.sessionService.refreshSession(dto.refreshToken, ip);
  }

  @Post('revoke-token')
  @Auth([UserRole.ADMIN, UserRole.STAFF])
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiResponse({ status: 200, description: 'Token revoked successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async revokeToken(
    @Body() dto: RevokeTokenDto,
    @Ip() ip: string,
  ): Promise<void> {
    await this.sessionService.revokeSession(dto.token, ip);
  }

  @Post('revoke-all')
  @Auth([UserRole.ADMIN])
  @ApiOperation({ summary: 'Revoke all sessions for a user' })
  @ApiResponse({
    status: 200,
    description: 'All sessions revoked successfully',
  })
  async revokeAllSessions(
    @Body() dto: RevokeAllSessionsDto,
    @Ip() ip: string,
  ): Promise<void> {
    await this.sessionService.revokeAllUserSessions(dto.userId, ip);
  }

  @Get('active-sessions')
  @Auth()
  @ApiOperation({ summary: 'Get all active sessions for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of active sessions',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          deviceInfo: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          createdByIp: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
          isActive: { type: 'boolean' },
        },
      },
    },
  })
  async getActiveSessions(): Promise<SessionInfo[]> {
    // TODO: Get user ID from JWT token
    const userId = 1; // Temporary
    return this.sessionService.getActiveSessionsForUser(userId);
  }
}
