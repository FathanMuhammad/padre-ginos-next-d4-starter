"use client";

import { catchError, type ErrorInfo } from "next/error";

// A component-level error boundary: one broken widget, not a broken page
function WidgetError({ title }: { title: string }, { retry }: ErrorInfo) {
  return (
    <div role="alert" className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase text-ink/60">{title}</h2>
      <p className="mt-3 text-red-800">Gagal memuat data ini.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-3 rounded-lg bg-ink px-3 py-1 text-sm font-semibold text-white"
      >
        Coba lagi
      </button>
    </div>
  );
}

export default catchError(WidgetError);
