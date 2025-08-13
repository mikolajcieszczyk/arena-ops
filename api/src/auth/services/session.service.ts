import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import {
  ISessionService,
  TokenResponse,
  SessionInfo,
} from '../interfaces/session.service.interface';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  private async hashToken(token: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(token, salt);
  }

  private getRefreshTokenTTL(): number {
    return (
      parseInt(this.configService.get('jwt.refreshTokenExpiresIn') ?? '7') *
      24 *
      60 *
      60 *
      1000
    ); // days to ms
  }

  async createSession(
    user: User,
    ip: string,
    deviceInfo?: string,
  ): Promise<TokenResponse> {
    const refreshToken = this.generateRefreshToken();
    const hashedToken = await this.hashToken(refreshToken);

    const token = this.refreshTokenRepository.create({
      user,
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + this.getRefreshTokenTTL()),
      createdByIp: ip,
      deviceInfo,
    });

    await this.refreshTokenRepository.save(token);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, refreshToken };
  }

  async refreshSession(
    refreshToken: string,
    ip: string,
  ): Promise<TokenResponse> {
    const token = await this.validateRefreshToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const newRefreshToken = this.generateRefreshToken();
    const hashedToken = await this.hashToken(newRefreshToken);

    // Create new refresh token
    const newToken = this.refreshTokenRepository.create({
      user: token.user,
      userId: token.userId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + this.getRefreshTokenTTL()),
      createdByIp: ip,
      deviceInfo: token.deviceInfo,
    });

    // Revoke old token
    token.revoked = true;
    token.revokedAt = new Date();
    token.revokedByIp = ip;
    token.replacedByToken = newToken.token;

    await this.refreshTokenRepository.save([token, newToken]);

    const accessToken = await this.jwtService.signAsync({
      sub: token.user.id,
      email: token.user.email,
      role: token.user.role,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async revokeSession(token: string, ip: string): Promise<void> {
    const refreshToken = await this.validateRefreshToken(token);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    refreshToken.revoked = true;
    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIp = ip;

    await this.refreshTokenRepository.save(refreshToken);
  }

  async revokeAllUserSessions(userId: number, ip: string): Promise<void> {
    const tokens = await this.refreshTokenRepository.find({
      where: {
        userId,
        revoked: false,
      },
    });

    const now = new Date();
    const updatedTokens = tokens.map((token) => ({
      ...token,
      revoked: true,
      revokedAt: now,
      revokedByIp: ip,
    }));

    await this.refreshTokenRepository.save(updatedTokens);
  }

  async getActiveSessionsForUser(userId: number): Promise<SessionInfo[]> {
    const tokens = await this.refreshTokenRepository.find({
      where: {
        userId,
        revoked: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return tokens.map((token) => ({
      id: token.id,
      deviceInfo: token.deviceInfo,
      createdAt: token.createdAt,
      createdByIp: token.createdByIp,
      expiresAt: token.expiresAt,
      isActive: token.isActive(),
    }));
  }

  async validateRefreshToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { revoked: false },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    if (!refreshToken || refreshToken.isExpired() || !refreshToken.isActive()) {
      return null;
    }

    const isValid = await bcrypt.compare(token, refreshToken.token);
    return isValid ? refreshToken : null;
  }
}
