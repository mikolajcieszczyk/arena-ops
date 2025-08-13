import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IAuthService } from './interfaces/auth.service.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ValidatePasswordResetTokenDto } from './dto/validate-password-reset-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  PasswordResetRequestResponse,
  PasswordResetValidationResponse,
} from './types/password-reset.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
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
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto);
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
}
