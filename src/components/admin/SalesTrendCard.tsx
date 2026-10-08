"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { date: string; revenue: number; orders: number };

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// Sales trend for the overview: totals, plus a chart on demand
export default function SalesTrendCard({ trend }: { trend: Point[] }) {
  const [showChart, setShowChart] = useState(false);
  const total = trend.reduce((sum, p) => sum + p.revenue, 0);
  const best = trend.reduce((a, b) => (b.revenue > a.revenue ? b : a), trend[0]);

  return (
    <div data-testid="widget-trend" className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-3">
      <h2 className="text-sm font-semibold uppercase text-ink/60">Tren 30 hari terakhir</h2>
      <div className="mt-3 flex flex-wrap gap-8">
        <p>
          <span className="block text-3xl font-black">{usd.format(total)}</span>
          <span className="text-ink/70">total pendapatan</span>
        </p>
        <p>
          <span className="block text-3xl font-black">{usd.format(total / trend.length)}</span>
          <span className="text-ink/70">rata-rata per hari</span>
        </p>
        {best && (
          <p>
            <span className="block text-3xl font-black">{best.date}</span>
            <span className="text-ink/70">hari terbaik ({usd.format(best.revenue)})</span>
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setShowChart((v) => !v)}
        className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
      >
        {showChart ? "Sembunyikan grafik" : "Tampilkan grafik"}
      </button>
      {showChart && (
        <div className="mt-4 h-64" data-testid="trend-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => usd.format(Number(value))} />
              <Line type="monotone" dataKey="revenue" stroke="#b91c1c" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
