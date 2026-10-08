import { Suspense } from "react";
import {
  LatestDayWidget,
  TrendWidget,
  StatusWidget,
  TopPizzasWidget,
  WidgetSkeleton,
} from "@/components/admin/OverviewWidgets";
import WidgetErrorBoundary from "@/components/admin/WidgetErrorBoundary";

// Each widget decides for itself: stream, cache, and what happens if it fails
export default function AdminHome() {
  return (
    <section>
      <h1 className="text-3xl font-black">Overview</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Suspense fallback={<WidgetSkeleton title="Hari terakhir" />}>
          <LatestDayWidget />
        </Suspense>

        <WidgetErrorBoundary title="Status order hari itu">
          <Suspense fallback={<WidgetSkeleton title="Status order hari itu" />}>
            <StatusWidget />
          </Suspense>
        </WidgetErrorBoundary>

        {/* The aggregate is still cached, but WHO is asking is request data:
            the permission check runs per request, so it streams now */}
        <Suspense fallback={<WidgetSkeleton title="Terlaris sepanjang masa" />}>
          <TopPizzasWidget />
        </Suspense>

        <Suspense fallback={<WidgetSkeleton title="Tren 30 hari terakhir" />}>
          <TrendWidget />
        </Suspense>
      </div>
    </section>
  );
}
