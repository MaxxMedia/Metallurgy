import type { Metadata } from "next";

import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
