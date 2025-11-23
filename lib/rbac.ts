import { User } from "better-auth";

interface UserT extends User {
  role: string;
}

export async function isAdmin(user: UserT) {
  try {
    if (user && user.role) {
      if (user.role == "admin") {
        return true;
      }
      throw new Error("user is not admin");
    }
    throw new Error("user doesnt exists");
  } catch (error: any) {
    return error.message;
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
