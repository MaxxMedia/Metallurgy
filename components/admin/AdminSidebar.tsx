"use client";

import Link from "next/link";

import { clearSession } from "@/lib/auth/session";

export type AdminTab =
  | "overview"
  | "companies"
  | "packages"
  | "suppliers"
  | "activity";

const NAV: { id: AdminTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-3-line" },
  { id: "companies", label: "Companies", icon: "ri-building-4-line" },
  { id: "packages", label: "Packages", icon: "ri-vip-crown-2-line" },
  { id: "suppliers", label: "Suppliers", icon: "ri-store-2-line" },
  { id: "activity", label: "Activity log", icon: "ri-pulse-line" },
];

type AdminSidebarProps = {
  email: string;
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
};

export function AdminSidebar({
  email,
  tab,
  onTabChange,
  onSignOut,
}: AdminSidebarProps) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <aside className="admin-sidebar w-full shrink-0 lg:w-[280px] lg:pt-2">
      <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0a0d11] lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
        {/* Brand */}
        <div className="border-b border-white/[0.06] px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0073ff] to-[#005bb5] text-xl text-white shadow-[0_8px_24px_rgba(0,115,255,0.35)]">
              <i className="ri-settings-3-line" aria-hidden />
            </span>
            <div>
              <p className="text-[15px] font-semibold leading-tight text-white">
                Admin panel
              </p>
              <p className="mt-0.5 text-xs text-white/45">Platform control</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0073ff]/20 text-sm font-semibold text-[#7eb8ff]"
            aria-hidden
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{email}</p>
            <p className="text-xs text-white/40">Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav flex-1 px-3 py-4" aria-label="Admin">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Menu
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
                    className={`admin-sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-[background-color,color,box-shadow] duration-150 ${
                      active
                        ? "admin-sidebar-link--active bg-[#0073ff]/12 text-white ring-1 ring-[#0073ff]/25"
                        : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${
                        active
                          ? "bg-[#0073ff] text-white shadow-md shadow-[#0073ff]/25"
                          : "bg-white/[0.05] text-white/45"
                      }`}
                    >
                      <i className={item.icon} aria-hidden />
                    </span>
                    <span className="text-[13px] font-medium leading-snug">
                      {item.label}
                    </span>
                    {active ? (
                      <i
                        className="ri-arrow-right-s-line ml-auto text-lg text-[#0073ff]"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="mt-auto border-t border-white/[0.06] p-3">
          <Link href="/" className="admin-sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-base">
              <i className="ri-home-4-line" aria-hidden />
            </span>
            Back to website
          </Link>
          <button
            type="button"
            onClick={() => {
              clearSession();
              onSignOut();
            }}
            className="admin-sidebar-link mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/55 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-base">
              <i className="ri-logout-box-r-line" aria-hidden />
            </span>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
