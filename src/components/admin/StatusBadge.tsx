import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";

const COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  preparing: "bg-sky-100 text-sky-900",
  ready: "bg-emerald-100 text-emerald-900",
  delivered: "bg-stone-200 text-stone-700",
  cancelled: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
