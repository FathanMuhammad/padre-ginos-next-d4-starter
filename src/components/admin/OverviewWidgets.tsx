import { getLatestDay, getSalesTrend, getStatusCounts, getTopPizzas } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orders";
import SalesTrendCard from "./SalesTrendCard";

const CARD = "rounded-2xl bg-white p-5 shadow-sm";

export function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className={CARD}>
      <h2 className="text-sm font-semibold uppercase text-ink/60">{title}</h2>
      <p className="mt-3 animate-pulse text-ink/40">Memuat…</p>
    </div>
  );
}

export async function LatestDayWidget() {
  const day = await getLatestDay();
  return (
    <div data-testid="widget-latest-day" className={CARD}>
      <h2 className="text-sm font-semibold uppercase text-ink/60">Hari terakhir</h2>
      <p className="mt-1 text-sm text-ink/60">{day.date}</p>
      <p className="mt-3 text-3xl font-black">{formatPrice(day.revenue)}</p>
      <p className="text-ink/70">{day.orders} order</p>
    </div>
  );
}

export async function StatusWidget() {
  const counts = await getStatusCounts();
  return (
    <div data-testid="widget-status" className={CARD}>
      <h2 className="text-sm font-semibold uppercase text-ink/60">Status order hari itu</h2>
      <ul className="mt-3 space-y-1">
        {ORDER_STATUSES.map((s) => (
          <li key={s} className="flex justify-between">
            <span>{STATUS_LABELS[s]}</span>
            <span className="font-semibold">{counts[s]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function TopPizzasWidget() {
  const topPizzas = await getTopPizzas();
  return (
    <div data-testid="widget-top-pizzas" className={CARD}>
      <h2 className="text-sm font-semibold uppercase text-ink/60">Terlaris sepanjang masa</h2>
      <ol className="mt-3 space-y-1">
        {topPizzas.map((p) => (
          <li key={p.id} className="flex justify-between gap-2">
            <span className="truncate">{p.name}</span>
            <span className="font-semibold">{p.sold.toLocaleString("en-US")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export async function TrendWidget() {
  const trend = await getSalesTrend();
  return <SalesTrendCard trend={trend} />;
}
