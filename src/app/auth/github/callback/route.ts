import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { fetchGithubProfile, githubClient } from "@/lib/github";
import { safeNext } from "@/lib/redirect";
import { createSession } from "@/lib/session";
import { upsertGithubUser } from "@/lib/users";

// Step 2: GitHub sends the browser back here with ?code=…&state=…
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("pg_oauth_state")?.value;
  const next = safeNext(cookieStore.get("pg_oauth_next")?.value);
  cookieStore.delete("pg_oauth_state");
  cookieStore.delete("pg_oauth_next");

  if (params.get("error")) redirect("/login?error=cancelled");

  // The state must be the one WE generated for THIS browser (stops CSRF)
  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state || !expectedState || state !== expectedState) {
    redirect("/login?error=state");
  }

  let userId: number;
  try {
    // Step 3: trade the one-time code for an access token (server to server)
    const tokens = await githubClient().validateAuthorizationCode(code);
    // Step 4: ask GitHub who this is, then find or create OUR user
    const profile = await fetchGithubProfile(tokens.accessToken());
    const user = await upsertGithubUser(profile);
    userId = user.id;
  } catch (error) {
    console.error("GitHub sign-in failed:", error);
    redirect(error instanceof OAuth2RequestError ? "/login?error=code" : "/login?error=github");
  }

  // Step 5: our own session. We do not keep GitHub's token at all.
  await createSession(userId);
  redirect(next);
}
