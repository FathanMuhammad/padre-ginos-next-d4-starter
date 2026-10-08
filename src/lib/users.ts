import "server-only";
import { all, get, run } from "./db";
import type { Profile, User } from "./types";

// Prepared before Day 3: plain queries, no rules. Who may call them is
// decided by the Data Access Layer (src/lib/auth.ts), not here.

const USER_COLUMNS =
  "id, login, name, avatar_url AS avatarUrl, role, phone, address";

export async function findUserById(id: number): Promise<User | null> {
  const user = await get<User>(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = ?`,
    [id],
  );
  return user ?? null;
}

// The seeded demo accounts used by the dev login (they have no GitHub id)
export async function findDemoUsers(): Promise<User[]> {
  return all<User>(
    `SELECT ${USER_COLUMNS} FROM users WHERE github_id IS NULL ORDER BY id`,
  );
}

export interface GithubProfile {
  githubId: string;
  login: string;
  name: string;
  avatarUrl: string | null;
}

// First sign-in creates a customer. Later sign-ins only refresh login and
// avatar: the name is editable on /account, the role is ours to decide.
export async function upsertGithubUser(profile: GithubProfile): Promise<User> {
  await run(
    `INSERT INTO users (github_id, login, name, avatar_url)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (github_id) DO UPDATE SET
       login = excluded.login, avatar_url = excluded.avatar_url`,
    [profile.githubId, profile.login, profile.name, profile.avatarUrl],
  );
  const user = await get<User>(
    `SELECT ${USER_COLUMNS} FROM users WHERE github_id = ?`,
    [profile.githubId],
  );
  if (!user) throw new Error("User upsert failed");
  return user;
}

export async function updateProfile(
  userId: number,
  profile: Profile,
): Promise<void> {
  await run("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?", [
    profile.name,
    profile.phone,
    profile.address,
    userId,
  ]);
}
