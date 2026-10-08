import type { Metadata } from "next";
import { Suspense } from "react";
import { devLoginAction } from "@/app/auth/actions";
import { isDevLoginEnabled } from "@/lib/auth";
import { safeNext } from "@/lib/redirect";
import { findDemoUsers } from "@/lib/users";
import { ROLE_LABELS } from "@/lib/roles";

export const metadata: Metadata = { title: "Masuk — Padre Gino's" };

const ERRORS: Record<string, string> = {
  cancelled: "Login dibatalkan di GitHub.",
  state: "Sesi login kedaluwarsa atau tidak cocok. Coba lagi.",
  code: "GitHub menolak login: kode kedaluwarsa, atau Client ID/Secret salah.",
  github: "Tidak bisa menghubungi GitHub. Cek koneksi dan konfigurasi OAuth App.",
  dev: "Demo user tidak dikenal.",
};

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-black">Masuk</h1>
      <p className="mt-1 text-sm text-ink/70">
        Kami hanya menanyakan ke GitHub <em>siapa kamu</em>. Apa yang boleh kamu
        lakukan, kami yang menentukan.
      </p>
      {/* searchParams is request data: stream it, keep the card in the shell */}
      <Suspense fallback={<div className="mt-6 h-12 animate-pulse rounded-lg bg-stone-200" />}>
        <LoginOptions searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginOptions({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;

  return (
    <>
      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {/* A plain <a>: this goes to a Route Handler that redirects to GitHub */}
      <a
        href={`/auth/github?next=${encodeURIComponent(next)}`}
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-semibold text-white hover:bg-ink/90"
      >
        Masuk dengan GitHub
      </a>
      {isDevLoginEnabled() && <DevLogin next={next} />}
    </>
  );
}

async function DevLogin({ next }: { next: string }) {
  const users = await findDemoUsers();
  return (
    <section className="mt-8 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-4">
      <h2 className="text-sm font-bold text-amber-900">Mode kelas: masuk sebagai demo user</h2>
      <p className="mt-1 text-xs text-amber-900/80">
        Aktif karena <code>AUTH_DEV_LOGIN=1</code>. Jangan pernah aktif di server sungguhan.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {users.map((user) => (
          <form key={user.id} action={devLoginAction}>
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="next" value={next} />
            <button className="w-full rounded-lg bg-white px-3 py-2 text-left text-sm font-medium shadow-sm hover:bg-amber-100">
              {user.name} <span className="text-ink/60">· {ROLE_LABELS[user.role]}</span>
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
