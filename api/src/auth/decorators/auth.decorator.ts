import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function Auth(...roles: string[]) {
  return applyDecorators(UseGuards(JwtAuthGuard), Roles(...roles));
}
