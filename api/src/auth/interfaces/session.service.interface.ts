import { User } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SessionInfo {
  id: string;
  deviceInfo: string | null;
  createdAt: Date;
  createdByIp: string;
  expiresAt: Date;
  isActive: boolean;
}

export interface ISessionService {
  createSession(
    user: User,
    ip: string,
    deviceInfo?: string,
  ): Promise<TokenResponse>;

  refreshSession(refreshToken: string, ip: string): Promise<TokenResponse>;

  revokeSession(token: string, ip: string): Promise<void>;

  revokeAllUserSessions(userId: number, ip: string): Promise<void>;

  getActiveSessionsForUser(userId: number): Promise<SessionInfo[]>;

  validateRefreshToken(token: string): Promise<RefreshToken | null>;
}
