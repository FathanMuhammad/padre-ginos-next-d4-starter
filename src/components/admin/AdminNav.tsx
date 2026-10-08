"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Produk", adminOnly: true },
  { href: "/admin/orders", label: "Order" },
  { href: "/admin/analytics", label: "Analitik" },
];

function NavLinks({
  pathname,
  canManageProducts,
}: {
  pathname: string | null;
  canManageProducts: boolean;
}) {
  // A UI hint: staff do not see "Produk". The pages and the action still check.
  const links = LINKS.filter((link) => !link.adminOnly || canManageProducts);
  return (
    <nav className="flex flex-col gap-1 px-3">
      {links.map(({ href, label }) => {
        const active =
          pathname !== null &&
          (href === "/admin" ? pathname === href : pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 font-medium ${
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// The only client part of the sidebar: it needs the current URL to highlight a link
export default function AdminNav({ canManageProducts }: { canManageProducts: boolean }) {
  return <NavLinks pathname={usePathname()} canManageProducts={canManageProducts} />;
}

// Shown in the static shell until the user and URL are known
export function AdminNavFallback() {
  return <NavLinks pathname={null} canManageProducts={false} />;
}
