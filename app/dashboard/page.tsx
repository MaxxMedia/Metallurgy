import type { Metadata } from "next";

import { UserDashboardView } from "@/components/user/UserDashboardView";

export const metadata: Metadata = {
  title: "My dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <UserDashboardView />;
}
