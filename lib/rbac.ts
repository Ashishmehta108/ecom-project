import { User } from "better-auth";

interface UserT extends User{
  role:"admin"|"user";
}




export async function isAdmin(user:UserT){


}

// Usage example:
/*
const user: User = { id: '1', role: Role.USER };
const admin: User = { id: '2', role: Role.ADMIN };

console.log(RBACControl.hasPermission(user, Permission.READ)); // true
console.log(RBACControl.hasPermission(user, Permission.WRITE)); // false
console.log(RBACControl.hasPermission(admin, Permission.MANAGE_USERS)); // true
*/
