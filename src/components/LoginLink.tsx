"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sends the user back to the page they tried to open after signing in
export default function LoginLink() {
  const pathname = usePathname();
  return (
    <Link
      href={`/login?next=${encodeURIComponent(pathname ?? "/")}`}
      className="inline-block rounded-lg bg-ink px-4 py-2 font-semibold text-white hover:bg-ink/90"
    >
      Masuk
    </Link>
  );
}
