export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Permission {
  READ = "READ",
  WRITE = "WRITE",
  DELETE = "DELETE",
  MANAGE_USERS = "MANAGE_USERS",
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ],
  [Role.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.MANAGE_USERS,
  ],
};

export interface User {
  id: string;
  role: Role;
}

export class RBACControl {
  static hasPermission(user: User, permission: Permission): boolean {
    const userPermissions = rolePermissions[user.role];
    return userPermissions.includes(permission);
  }

  static isAdmin(user: User): boolean {
    return user.role === Role.ADMIN;
  }

  static isUser(user: User): boolean {
    return user.role === Role.USER;
  }
}

// Usage example:
/*
const user: User = { id: '1', role: Role.USER };
const admin: User = { id: '2', role: Role.ADMIN };

console.log(RBACControl.hasPermission(user, Permission.READ)); // true
console.log(RBACControl.hasPermission(user, Permission.WRITE)); // false
console.log(RBACControl.hasPermission(admin, Permission.MANAGE_USERS)); // true
*/
