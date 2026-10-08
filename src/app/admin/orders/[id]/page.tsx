import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import StatusActions from "@/components/admin/StatusActions";
import StatusBadge from "@/components/admin/StatusBadge";
import { getDayOrderCount, getOrder, getPizzasSoldOnDay } from "@/lib/admin-data";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { can } from "@/lib/permissions";

export default async function OrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const [order, user] = await Promise.all([
    getOrder(orderId),
    getCurrentUser(),
  ]);
  if (!order) notFound();

  // Non-blocking promises for extra context: streamed inside Suspense
  const dayOrderCountPromise = getDayOrderCount(order.date);
  const pizzaIds = Array.from(new Set(order.lines.map((l) => l.pizzaId)));
  const soldPromise = getPizzasSoldOnDay(pizzaIds, order.date);

  return (
    <section className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-brand hover:underline">
        ← Semua order
      </Link>
      <h1 className="mt-4 text-3xl font-black">Order #{order.id}</h1>
      <p className="mt-1 flex items-center gap-3 text-ink/70">
        {order.date} {order.time}
        <Suspense fallback={<span className="text-sm text-ink/40 animate-pulse" data-testid="day-order-count">· … order hari itu</span>}>
          <DayOrderCount countPromise={dayOrderCountPromise} />
        </Suspense>
        <span data-testid="order-status">
          <StatusBadge status={order.status} />
        </span>
      </p>
      {/* A UI hint only: the real check is inside updateOrderStatusAction */}
      {can(user, "orders:update") && <StatusActions orderId={order.id} status={order.status} />}

      <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <thead className="bg-stone-50 text-xs uppercase text-ink/60">
          <tr>
            <th className="px-4 py-3">Pizza</th>
            <th className="px-4 py-3">Ukuran</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Harga</th>
            <th className="px-4 py-3 text-right">Terjual hari itu</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line, i) => (
            <tr key={i} className="border-t border-black/5">
              <td className="px-4 py-2">
                {can(user, "products:manage") ? (
                  <Link href={`/admin/products/${line.pizzaId}`} className="hover:underline">
                    {line.name}
                  </Link>
                ) : (
                  line.name
                )}
              </td>
              <td className="px-4 py-2">{line.size}</td>
              <td className="px-4 py-2 text-right">{line.quantity}</td>
              <td className="px-4 py-2 text-right">{formatPrice(line.price)}</td>
              <td className="px-4 py-2 text-right" data-testid="sold-that-day">
                <Suspense fallback={<span className="text-ink/40 animate-pulse">…</span>}>
                  <SoldThatDay pizzaId={line.pizzaId} soldPromise={soldPromise} />
                </Suspense>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right text-lg font-bold" data-testid="order-total">
        Total {formatPrice(order.total)}
      </p>
    </section>
  );
}

async function DayOrderCount({ countPromise }: { countPromise: Promise<number> }) {
  const count = await countPromise;
  return (
    <span className="text-sm" data-testid="day-order-count">
      · {count} order hari itu
    </span>
  );
}

async function SoldThatDay({
  pizzaId,
  soldPromise,
}: {
  pizzaId: string;
  soldPromise: Promise<Record<string, number>>;
}) {
  const sold = await soldPromise;
  return <>{sold[pizzaId] ?? 0}</>;
}
