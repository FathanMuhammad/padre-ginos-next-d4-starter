import { generateState } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { githubClient } from "@/lib/github";
import { safeNext } from "@/lib/redirect";

const TEN_MINUTES = 60 * 10;

// Step 1: send the browser to GitHub with a random "state" we remember
export async function GET(request: NextRequest) {
  const state = generateState();
  const url = githubClient().createAuthorizationURL(state, ["read:user"]);

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TEN_MINUTES,
  };
  cookieStore.set("pg_oauth_state", state, options);
  cookieStore.set("pg_oauth_next", safeNext(request.nextUrl.searchParams.get("next")), options);

  redirect(url.toString());
}
