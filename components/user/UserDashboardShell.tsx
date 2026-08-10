"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { clearSession } from "@/lib/auth/session";

export type UserTab = "overview" | "profile" | "applications" | "saved";

const NAV: { id: UserTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-3-line" },
  { id: "profile", label: "My profile", icon: "ri-user-3-line" },
  { id: "applications", label: "Applications", icon: "ri-file-list-3-line" },
  { id: "saved", label: "Saved jobs", icon: "ri-bookmark-line" },
];

type UserDashboardShellProps = {
  email: string;
  displayName: string;
  tab: UserTab;
  onTabChange: (tab: UserTab) => void;
  onSignOut: () => void;
  children: ReactNode;
};

export function UserDashboardShell({
  email,
  displayName,
  tab,
  onTabChange,
  onSignOut,
  children,
}: UserDashboardShellProps) {
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="user-dashboard relative min-h-[70vh] w-full pb-16 pt-4 md:pt-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_70%_50%_at_70%_-15%,rgba(0,115,255,0.16),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-6 px-4 lg:flex-row lg:gap-0 lg:px-6 xl:px-8">
        <aside className="user-sidebar w-full shrink-0 lg:w-[260px] lg:pt-2">
          <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0a0d11] lg:sticky lg:top-24">
            <div className="border-b border-white/[0.06] px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0073ff] to-[#005bb5] text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,115,255,0.3)]">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-white/45">{email}</p>
                </div>
              </div>
            </div>

            <nav className="p-3" aria-label="Dashboard">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                Workspace
              </p>
              <ul className="flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = tab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange(item.id)}
                        aria-current={active ? "page" : undefined}
                        className={`user-sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "bg-[#0073ff]/12 text-white ring-1 ring-[#0073ff]/25"
                            : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${
                            active
                              ? "bg-[#0073ff] text-white"
                              : "bg-white/[0.05] text-white/45"
                          }`}
                        >
                          <i className={item.icon} aria-hidden />
                        </span>
                        <span className="text-[13px] font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto border-t border-white/[0.06] p-3">
              <Link
                href="/"
                className="user-sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                  <i className="ri-compass-3-line" aria-hidden />
                </span>
                Explore site
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  onSignOut();
                }}
                className="user-sidebar-link mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-red-500/10 hover:text-red-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                  <i className="ri-logout-box-r-line" aria-hidden />
                </span>
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 lg:pl-8">{children}</main>
      </div>
    </div>
  );
}

export const USER_TAB_COPY: Record<
  UserTab,
  { title: string; description: string }
> = {
  overview: {
    title: "Dashboard",
    description: "Your job search at a glance — profile strength, applications, and next steps.",
  },
  profile: {
    title: "My profile",
    description: "Details recruiters see when you apply. Keep this up to date.",
  },
  applications: {
    title: "My applications",
    description: "Track jobs you have applied to and their status.",
  },
  saved: {
    title: "Saved jobs",
    description: "Jobs you bookmarked for later.",
  },
};
