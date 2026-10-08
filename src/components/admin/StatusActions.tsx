"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { nextStatuses, STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export default function StatusActions({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    null,
  );
  const options = nextStatuses(status);

  if (options.length === 0) {
    return <p className="mt-6 text-sm text-ink/60">Status final, tidak bisa diubah lagi.</p>;
  }

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="flex gap-2">
        {options.map((next) => (
          <button
            key={next}
            type="submit"
            name="status"
            value={next}
            disabled={isPending}
            className={`rounded-lg px-4 py-2 font-semibold text-white disabled:opacity-50 ${
              next === "cancelled" ? "bg-red-700" : "bg-ink"
            }`}
          >
            Ubah ke {STATUS_LABELS[next]}
          </button>
        ))}
        {isPending && <span className="self-center text-sm text-ink/60">Menyimpan…</span>}
      </div>
      {state?.error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
