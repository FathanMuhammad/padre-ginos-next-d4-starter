import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import AdminNav from "./AdminNav";

// Server part: reads the user once, passes a plain boolean to the client nav
export default async function AdminNavigation() {
  const user = await getCurrentUser();
  return <AdminNav canManageProducts={can(user, "products:manage")} />;
}
