import "server-only";
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";

// The session is the ONE piece of state the browser holds for us:
// an encrypted cookie that only says which user this is.
type SessionData = { userId?: number };

const COOKIE_NAME = "pg_session";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function password(): string {
  const value = process.env.SESSION_PASSWORD;
  if (!value || value.length < 32) {
    throw new Error("SESSION_PASSWORD di .env.local minimal 32 karakter.");
  }
  return value;
}

export async function getSession(): Promise<SessionData> {
  const seal = (await cookies()).get(COOKIE_NAME)?.value;
  if (!seal) return {};
  // Expired or tampered seals come back as an empty object
  return unsealData<SessionData>(seal, { password: password(), ttl: TTL_SECONDS });
}

// Only callable where cookies can be written: Server Actions, Route Handlers
export async function createSession(userId: number): Promise<void> {
  const seal = await sealData({ userId } satisfies SessionData, {
    password: password(),
    ttl: TTL_SECONDS,
  });
  (await cookies()).set(COOKIE_NAME, seal, {
    httpOnly: true, // JavaScript in the page cannot read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // sent on top-level navigation back from GitHub
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
