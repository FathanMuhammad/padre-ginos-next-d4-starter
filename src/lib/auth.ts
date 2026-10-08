import "server-only";
import { forbidden, unauthorized } from "next/navigation";
import { cache } from "react";
import { can, type Permission } from "./permissions";
import { getSession } from "./session";
import { findUserById } from "./users";
import type { User } from "./types";

// Data Access Layer: the only place that turns a cookie into a user.
// cache() makes every call in the same request share one lookup.
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { userId } = await getSession();
  if (!userId) return null;
  // The cookie says who; the database says what they are allowed (role)
  return findUserById(userId);
});

export function isDevLoginEnabled(): boolean {
  return process.env.AUTH_DEV_LOGIN === "1";
}

// For pages and actions that only need "signed in", whatever the role
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) unauthorized();
  return user;
}

// The guard every protected read and every protected Server Action calls.
// Not signed in → 401 (unauthorized.tsx). Signed in, wrong role → 403 (forbidden.tsx).
export async function requirePermission(permission: Permission): Promise<User> {
  const user = await getCurrentUser();
  if (!user) unauthorized();
  if (!can(user, permission)) forbidden();
  return user;
}
