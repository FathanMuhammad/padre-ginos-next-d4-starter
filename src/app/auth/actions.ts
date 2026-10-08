"use server";

import { redirect } from "next/navigation";
import { isDevLoginEnabled } from "@/lib/auth";
import { safeNext } from "@/lib/redirect";
import { createSession, deleteSession } from "@/lib/session";
import { findDemoUsers } from "@/lib/users";

// Classroom only. Note that it still checks the id against the demo users:
// even a dev shortcut must not let you become a real GitHub account.
export async function devLoginAction(formData: FormData) {
  if (!isDevLoginEnabled()) redirect("/login");
  const userId = Number(formData.get("userId"));
  const demoUsers = await findDemoUsers();
  if (!demoUsers.some((u) => u.id === userId)) redirect("/login?error=dev");

  await createSession(userId);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
