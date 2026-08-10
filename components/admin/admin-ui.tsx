"use client";

import type { ReactNode } from "react";

const ACCENT = "#0073ff";

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function AdminLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#0073ff]"
        aria-hidden
      />
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}

export function AdminErrorState({
  message,
  children,
}: {
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="admin-panel mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8">
        <i className="ri-error-warning-line mb-3 text-3xl text-red-400" aria-hidden />
        <p className="text-red-300">{message}</p>
        {children}
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
  hint?: string;
};

export function StatCard({ label, value, icon, accent = ACCENT, hint }: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141820]/90 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-35"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-white md:text-[1.65rem]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-white/40">{hint}</p>
          ) : null}
        </div>
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-white/90"
          style={{ color: accent }}
        >
          <i className={icon} aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let cls =
    "border-white/15 bg-white/5 text-white/70";
  if (s.includes("approve") || s === "active" || s === "paid" || s === "live") {
    cls = "border-emerald-500/35 bg-emerald-500/15 text-emerald-300";
  } else if (s.includes("pend") || s === "draft") {
    cls = "border-amber-500/35 bg-amber-500/15 text-amber-200";
  } else if (s.includes("reject") || s === "inactive") {
    cls = "border-red-500/35 bg-red-500/15 text-red-300";
  }
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: string }) {
  const p = (plan || "free").toLowerCase();
  const map: Record<string, string> = {
    free: "border-white/15 bg-white/5 text-white/65",
    basic: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    standard: "border-[#0073ff]/40 bg-[#0073ff]/15 text-blue-200",
    professional: "border-violet-500/35 bg-violet-500/15 text-violet-200",
    premium: "border-amber-500/35 bg-amber-500/15 text-amber-200",
    enterprise: "border-emerald-500/35 bg-emerald-500/15 text-emerald-200",
  };
  const cls = map[p] ?? map.free;
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${cls}`}
    >
      {plan || "free"}
    </span>
  );
}

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#141820]/80 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 md:px-6">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export function RoleBreakdown({
  rows,
}: {
  rows: { name: string; value: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.name}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-white/80">{row.name}</span>
            <span className="font-medium tabular-nums text-white">{row.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0073ff] to-[#00a3ff] transition-all duration-500"
              style={{ width: `${Math.round((row.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function GrowthTable({
  rows,
}: {
  rows: {
    month: string;
    users: number;
    jobs: number;
    applications: number;
  }[];
}) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-[11px] font-medium uppercase tracking-wider text-white/45">
            <th className="pb-3 pr-4 font-medium">Month</th>
            <th className="pb-3 pr-4 font-medium">Users</th>
            <th className="pb-3 pr-4 font-medium">Jobs</th>
            <th className="pb-3 font-medium">Applications</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.month}
              className={`border-t border-white/[0.06] ${
                i % 2 === 0 ? "bg-white/[0.02]" : ""
              }`}
            >
              <td className="py-3.5 pr-4 font-medium text-white/90">{row.month}</td>
              <td className="py-3.5 pr-4 tabular-nums text-white/75">{row.users}</td>
              <td className="py-3.5 pr-4 tabular-nums text-white/75">{row.jobs}</td>
              <td className="py-3.5 tabular-nums text-white/75">{row.applications}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  renderCell,
}: {
  columns: string[];
  rows: string[][];
  renderCell?: (colIndex: number, value: string, rowIndex: number) => ReactNode;
}) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <i className="ri-inbox-line mb-2 text-3xl text-white/25" aria-hidden />
        <p className="text-sm text-white/45">No records yet.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-white/[0.04] text-[11px] font-medium uppercase tracking-wider text-white/45">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3.5 font-medium md:px-5">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.03]"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3.5 text-white/85 md:px-5">
                  {renderCell ? renderCell(j, cell, i) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PackageGrid({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <i className="ri-price-tag-3-line mb-2 text-3xl text-white/25" aria-hidden />
        <p className="text-sm text-white/45">No packages configured.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((pkg, i) => {
        const name = String(pkg.name ?? pkg.title ?? pkg.id ?? `Package ${i + 1}`);
        const type = String(pkg.type ?? pkg.category ?? "—");
        const price =
          pkg.price != null
            ? String(pkg.price)
            : pkg.amount != null
              ? String(pkg.amount)
              : "—";
        const active = pkg.isActive !== false;
        return (
          <article
            key={String(pkg.id ?? i)}
            className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{name}</h3>
              <StatusBadge status={active ? "active" : "inactive"} />
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/40">{type}</p>
            <p className="mt-4 text-xl font-semibold tabular-nums text-[#0073ff]">
              {price === "—" ? price : `$${price}`}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function formatRevenue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}
