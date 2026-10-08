import Form from "next/form";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

// The URL is the state: /admin/orders?page=2&date=2015-12-31
function parsePage(value: string | string[] | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

function parseDate(value: string | string[] | undefined): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

export default async function OrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const date = parseDate(params.date);
  const { orders, totalPages } = await getOrders({ page, date });

  const pageHref = (n: number) =>
    `/admin/orders?${new URLSearchParams({
      page: String(n),
      ...(date ? { date } : {}),
    })}`;

  return (
    <section>
      <h1 className="text-3xl font-black">Order</h1>

      <Form action="/admin/orders" className="mt-4 flex items-end gap-3">
        <label className="flex flex-col text-sm font-medium">
          Tanggal
          <input
            type="date"
            name="date"
            defaultValue={date ?? ""}
            className="mt-1 rounded-lg border border-black/10 bg-white px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-lg bg-ink px-4 py-2 font-semibold text-white">
          Filter
        </button>
        {date && (
          <Link href="/admin/orders" className="py-2 text-sm underline">
            Reset
          </Link>
        )}
      </Form>

      <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <thead className="bg-stone-50 text-xs uppercase text-ink/60">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Waktu</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Item</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-black/5">
              <td className="px-4 py-2">
                <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand hover:underline">
                  #{o.id}
                </Link>
              </td>
              <td className="px-4 py-2">
                {o.date} {o.time}
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={o.status} />
              </td>
              <td className="px-4 py-2 text-right">{o.items}</td>
              <td className="px-4 py-2 text-right">{formatPrice(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="mt-6 text-ink/60">Tidak ada order.</p>}

      <nav className="mt-4 flex items-center gap-4 text-sm" aria-label="Halaman">
        {page > 1 && <Link href={pageHref(page - 1)}>← Sebelumnya</Link>}
        <span>
          Halaman {page} dari {totalPages}
        </span>
        {page < totalPages && <Link href={pageHref(page + 1)}>Berikutnya →</Link>}
      </nav>
    </section>
  );
}
