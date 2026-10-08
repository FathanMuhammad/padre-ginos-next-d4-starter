import type { Role, User } from "./types";

// Authorization = WHAT can you do? One table, readable by anyone on the team.
// Pure functions: safe on the server (enforcement) and the client (UI hints).
export const PERMISSIONS = {
  "admin:view": ["staff", "admin"],
  "orders:update": ["staff", "admin"],
  "products:manage": ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(user: Pick<User, "role"> | null, permission: Permission): boolean {
  if (!user) return false;
  return (PERMISSIONS[permission] as readonly Role[]).includes(user.role);
}
