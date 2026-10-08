import Link from "next/link";
import { logoutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

// Reads the session cookie, so it must sit inside <Suspense>
export default async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand hover:bg-white/90"
      >
        Masuk
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3 text-sm" data-testid="user-menu">
      <Link href="/account" className="font-semibold hover:underline">
        {user.name}
      </Link>
      <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{ROLE_LABELS[user.role]}</span>
      <form action={logoutAction}>
        <button className="text-white/80 hover:text-white">Keluar</button>
      </form>
    </div>
  );
}

export function UserMenuFallback() {
  return <span className="h-7 w-24 animate-pulse rounded-full bg-white/15" />;
}
