import Link from "next/link";

// Rendered when forbidden() is called: we know who you are, the answer is no (403)
export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-sm font-bold text-ink/50">403</p>
        <h1 className="mt-1 text-2xl font-black">Akses ditolak</h1>
        <p className="mt-2 text-sm text-ink/70">
          Akunmu tidak punya izin untuk halaman atau aksi ini.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-brand hover:underline">
          Kembali ke toko
        </Link>
      </div>
    </main>
  );
}
