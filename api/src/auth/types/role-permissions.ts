import { UserRole } from '../../users/enums/user-role.enum';
import { Action } from './action.enum';
import { Resource } from './resource.enum';
import { Permission, createPermission } from './permission.type';

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin ma pełny dostęp do wszystkich zasobów
    ...Object.values(Resource).map((resource) =>
      createPermission(Action.MANAGE, resource),
    ),
  ],

  [UserRole.STAFF]: [
    // Rezerwacje - pełny dostęp
    createPermission(Action.MANAGE, Resource.BOOKINGS),

    // Klienci - pełny dostęp
    createPermission(Action.MANAGE, Resource.CLIENTS),

    // Korty - tylko odczyt i aktualizacja
    createPermission(Action.READ, Resource.COURTS),
    createPermission(Action.UPDATE, Resource.COURTS),

    // Raporty - tylko odczyt
    createPermission(Action.READ, Resource.REPORTS),
  ],

  [UserRole.CLIENT]: [
    // Rezerwacje - podstawowe operacje
    createPermission(Action.CREATE, Resource.BOOKINGS),
    createPermission(Action.READ, Resource.BOOKINGS),
    createPermission(Action.UPDATE, Resource.BOOKINGS),
    createPermission(Action.DELETE, Resource.BOOKINGS),

    // Korty - tylko odczyt
    createPermission(Action.READ, Resource.COURTS),
  ],
};

export class PermissionHelper {
  static hasPermission(
    userRole: UserRole,
    requiredPermission: Permission,
  ): boolean {
    const userPermissions = RolePermissions[userRole];

    // Jeśli użytkownik ma uprawnienie MANAGE dla zasobu, ma dostęp do wszystkich akcji
    const [reqAction, reqResource] = requiredPermission.split(':') as [
      Action,
      Resource,
    ];
    const hasManagePermission = userPermissions.includes(
      `${Action.MANAGE}:${reqResource}` as Permission,
    );

    return hasManagePermission || userPermissions.includes(requiredPermission);
  }

  static hasAnyPermission(
    userRole: UserRole,
    permissions: Permission[],
  ): boolean {
    return permissions.some((permission) =>
      this.hasPermission(userRole, permission),
    );
  }

  static hasAllPermissions(
    userRole: UserRole,
    permissions: Permission[],
  ): boolean {
    return permissions.every((permission) =>
      this.hasPermission(userRole, permission),
    );
  }
}
