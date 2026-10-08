import type { Metadata } from "next";
import { Suspense } from "react";
import SalesExplorer from "@/components/admin/SalesExplorer";
import { getDailySales } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Analitik — Padre Gino's" };

export default function AnalyticsPage() {
  return (
    <section>
      <h1 className="text-3xl font-black">Analitik penjualan</h1>
      <p className="mt-1 text-ink/60">Penjualan harian per pizza, 2015. Ketik untuk menyaring.</p>
      <Suspense fallback={<p className="mt-6 animate-pulse text-ink/60">Memuat data penjualan…</p>}>
        <Explorer />
      </Suspense>
    </section>
  );
}

async function Explorer() {
  const sales = await getDailySales();
  return <SalesExplorer sales={sales} />;
}
