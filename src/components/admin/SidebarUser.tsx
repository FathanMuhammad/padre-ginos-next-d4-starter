import { logoutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

// Shows who is signed in. It does NOT protect anything: the checks live in
// the Data Access Layer and in every Server Action.
export default async function SidebarUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="border-t border-white/10 px-6 py-4 text-sm" data-testid="sidebar-user">
      <p className="font-semibold text-white">{user.name}</p>
      <p className="text-xs text-white/60">{ROLE_LABELS[user.role]}</p>
      <form action={logoutAction} className="mt-2">
        <button className="text-xs text-white/70 hover:text-white">Keluar</button>
      </form>
    </div>
  );
}
