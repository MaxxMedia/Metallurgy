"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { AdminSidebar, type AdminTab } from "@/components/admin/AdminSidebar";

export type { AdminTab };

type AdminShellProps = {
  email: string;
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
  children: ReactNode;
};

export function AdminShell({
  email,
  tab,
  onTabChange,
  onSignOut,
  children,
}: AdminShellProps) {
  return (
    <div className="admin-console relative min-h-[70vh] w-full pb-16 pt-4 md:pt-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_70%_50%_at_30%_-15%,rgba(0,115,255,0.18),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-6 px-4 lg:flex-row lg:gap-0 lg:px-6 xl:px-8">
        <AdminSidebar
          email={email}
          tab={tab}
          onTabChange={onTabChange}
          onSignOut={onSignOut}
        />

        <main className="min-w-0 flex-1 lg:pl-8">
          <div className="rounded-2xl border border-white/[0.07] bg-[#101318]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
