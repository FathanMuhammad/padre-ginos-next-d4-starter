"use client";

import { createContext, use, useEffect, useState } from "react";

// Everything "live" in the dashboard, in one place
type Live = {
  now: number | null;
  pending: number | null;
  checkedAt: number | null;
  formatPrice: (value: number) => string;
};

const LiveContext = createContext<Live | null>(null);

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<number | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [checkedAt, setCheckedAt] = useState<number | null>(null);

  // A clock for "checked 3 s ago"
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Ask the server for the number of waiting orders every 5 seconds
  useEffect(() => {
    async function poll() {
      const response = await fetch("/api/admin/live");
      if (!response.ok) return;
      const data = (await response.json()) as { pending: number };
      setPending(data.pending);
      setCheckedAt(Date.now());
    }
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return <LiveContext value={{ now, pending, checkedAt, formatPrice }}>{children}</LiveContext>;
}

export function useLive(): Live {
  const live = use(LiveContext);
  if (!live) throw new Error("useLive must be used inside <LiveProvider>");
  return live;
}
