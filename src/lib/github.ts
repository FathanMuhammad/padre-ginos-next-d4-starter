import "server-only";
import { GitHub } from "arctic";
import type { GithubProfile } from "./users";

export function githubClient(): GitHub {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET belum diisi di .env.local.");
  }
  // null: use the callback URL registered in the GitHub OAuth App
  return new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null);
}

// Ask GitHub who owns this access token
export async function fetchGithubProfile(accessToken: string): Promise<GithubProfile> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "padre-ginos-workshop",
    },
  });
  if (!response.ok) throw new Error(`GitHub /user ${response.status}`);
  const data = (await response.json()) as {
    id: number;
    login: string;
    name: string | null;
    avatar_url: string | null;
  };
  return {
    githubId: String(data.id),
    login: data.login,
    name: data.name ?? data.login,
    avatarUrl: data.avatar_url,
  };
}
