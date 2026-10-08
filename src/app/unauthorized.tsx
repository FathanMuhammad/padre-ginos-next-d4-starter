import Link from "next/link";
import { Suspense } from "react";
import LoginLink from "@/components/LoginLink";

// Rendered when unauthorized() is called: we do not know who you are (401)
export default function Unauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-sm font-bold text-ink/50">401</p>
        <h1 className="mt-1 text-2xl font-black">Kamu perlu masuk dulu</h1>
        <p className="mt-2 text-sm text-ink/70">Halaman ini hanya untuk pengguna yang sudah masuk.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Suspense fallback={null}>
            <LoginLink />
          </Suspense>
          <Link href="/" className="text-sm text-brand hover:underline">Ke toko</Link>
        </div>
      </div>
    </main>
  );
}
