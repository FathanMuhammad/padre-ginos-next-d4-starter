import { getPendingCount } from "@/lib/admin-data";

// Polled by the dashboard sidebar
export async function GET() {
  const pending = await getPendingCount();
  return Response.json({ pending });
}
