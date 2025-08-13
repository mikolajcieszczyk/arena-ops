import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';
import { Permission } from '../types/permission.type';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RequirePermissions } from './permissions.decorator';
import { RoleGuard } from '../guards/role.guard';

export function Auth(roles?: UserRole[], permissions?: Permission[]) {
  const decorators = [UseGuards(JwtAuthGuard, RoleGuard)];

  if (roles) {
    decorators.push(Roles(...roles));
  }

  if (permissions) {
    decorators.push(RequirePermissions(...permissions));
  }

  return applyDecorators(...decorators);
}
