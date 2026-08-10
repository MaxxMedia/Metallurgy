"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  AdminErrorState,
  AdminLoading,
  AdminPageHeader,
  DataTable,
  formatRevenue,
  GrowthTable,
  PackageGrid,
  PlanBadge,
  RoleBreakdown,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { AdminShell, type AdminTab } from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/admin/api";
import { isAdminRole, readSession } from "@/lib/auth/session";

type Overview = {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalPosts: number;
  totalDirectories: number;
  totalEvents: number;
  totalRevenue: number;
  paidOrders: number;
  pendingOrders: number;
};

type AnalyticsPayload = {
  overview: Overview;
  usersByRole: { name: string; value: number }[];
  growthChart: {
    month: string;
    users: number;
    jobs: number;
    applications: number;
  }[];
};

type CompanyRow = {
  id: number;
  name: string;
  slug: string;
  subscriptionPlan: string;
};

type SupplierRow = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
};

type ActivityRow = {
  id: number;
  action: string;
  module: string;
  createdAt: string;
  User?: { email: string; fullName: string | null };
};

const TAB_COPY: Record<AdminTab, { title: string; description: string }> = {
  overview: {
    title: "Overview",
    description: "High-level metrics across users, jobs, content, and revenue.",
  },
  companies: {
    title: "Companies",
    description: "Registered organizations and their subscription plans.",
  },
  packages: {
    title: "Packages",
    description: "Subscription and product packages available on the platform.",
  },
  suppliers: {
    title: "Supplier listings",
    description: "Directory submissions and approval status.",
  },
  activity: {
    title: "Activity log",
    description: "Recent administrative actions for audit and troubleshooting.",
  },
};

export function AdminDashboardView() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
  const [packages, setPackages] = useState<Record<string, unknown>[] | null>(
    null,
  );
  const [suppliers, setSuppliers] = useState<SupplierRow[] | null>(null);
  const [activity, setActivity] = useState<ActivityRow[] | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    if (!session?.token) {
      router.replace("/login");
      return;
    }
    if (!isAdminRole(session.user.role)) {
      router.replace("/");
      return;
    }
    setToken(session.token);
    setEmail(session.user.email);

    (async () => {
      const res = await apiFetch<AnalyticsPayload>(
        "/api/admin/analytics",
        session.token,
      );
      if (res.error) setError(res.error);
      else setAnalytics(res.data ?? null);
      setLoading(false);
    })();
  }, [router]);

  const loadTab = useCallback(
    async (next: AdminTab) => {
      if (!token) return;
      setSectionError(null);
      setSectionLoading(true);

      if (next === "companies" && companies === null) {
        const res = await apiFetch<CompanyRow[]>("/api/admin/companies", token);
        if (res.error) setSectionError(res.error);
        else setCompanies(Array.isArray(res.data) ? res.data : []);
      }

      if (next === "packages" && packages === null) {
        const res = await apiFetch<{ packages?: unknown[] } | unknown[]>(
          "/api/admin/packages",
          token,
        );
        if (res.error) setSectionError(res.error);
        else {
          const raw = res.data;
          let list: unknown[] = [];
          if (Array.isArray(raw)) list = raw;
          else if (raw && typeof raw === "object" && "packages" in raw) {
            list = Array.isArray(raw.packages) ? raw.packages : [];
          }
          setPackages(
            list.filter(
              (x): x is Record<string, unknown> => !!x && typeof x === "object",
            ),
          );
        }
      }

      if (next === "suppliers" && suppliers === null) {
        const res = await apiFetch<SupplierRow[]>(
          "/api/admin/suppliers/admin",
          token,
        );
        if (res.error) setSectionError(res.error);
        else setSuppliers(Array.isArray(res.data) ? res.data : []);
      }

      if (next === "activity" && activity === null) {
        const res = await apiFetch<{ items: ActivityRow[] }>(
          "/api/admin/activity?pageSize=30",
          token,
        );
        if (res.error) setSectionError(res.error);
        else setActivity(res.data?.items ?? []);
      }

      setSectionLoading(false);
    },
    [token, companies, packages, suppliers, activity],
  );

  useEffect(() => {
    if (tab !== "overview") void loadTab(tab);
  }, [tab, loadTab]);

  if (loading) {
    return (
      <div className="admin-console">
        <AdminLoading label="Loading admin dashboard…" />
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <AdminErrorState message={error}>
        <p className="mt-3 text-sm text-white/50">
          Sign in with a seeded admin account after running{" "}
          <code className="text-white/70">npm run seed:admin</code> in
          metrology-backend.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0073ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0062d9]"
        >
          <i className="ri-login-box-line" aria-hidden />
          Back to login
        </Link>
      </AdminErrorState>
    );
  }

  const o = analytics?.overview;
  const copy = TAB_COPY[tab];

  return (
    <AdminShell
      email={email}
      tab={tab}
      onTabChange={setTab}
      onSignOut={() => router.push("/login")}
    >
      <AdminPageHeader title={copy.title} description={copy.description} />

      {tab === "overview" && o ? (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total users"
              value={o.totalUsers.toLocaleString()}
              icon="ri-group-line"
            />
            <StatCard
              label="Companies"
              value={o.totalCompanies.toLocaleString()}
              icon="ri-building-4-line"
              accent="#6366f1"
            />
            <StatCard
              label="Active jobs"
              value={`${o.activeJobs} / ${o.totalJobs}`}
              icon="ri-briefcase-4-line"
              hint="Active / total postings"
              accent="#14b8a6"
            />
            <StatCard
              label="Applications"
              value={o.totalApplications.toLocaleString()}
              icon="ri-file-list-3-line"
              accent="#f59e0b"
            />
            <StatCard
              label="Posts"
              value={o.totalPosts.toLocaleString()}
              icon="ri-article-line"
            />
            <StatCard
              label="Supplier listings"
              value={o.totalDirectories.toLocaleString()}
              icon="ri-store-3-line"
              accent="#a855f7"
            />
            <StatCard
              label="Events"
              value={o.totalEvents.toLocaleString()}
              icon="ri-calendar-event-line"
              accent="#ec4899"
            />
            <StatCard
              label="Revenue"
              value={formatRevenue(o.totalRevenue)}
              icon="ri-money-dollar-circle-line"
              hint={`${o.paidOrders} paid · ${o.pendingOrders} pending`}
              accent="#22c55e"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {analytics?.usersByRole?.length ? (
              <SectionCard title="Users by role">
                <RoleBreakdown rows={analytics.usersByRole} />
              </SectionCard>
            ) : null}

            {analytics?.growthChart?.length ? (
              <SectionCard title="Growth · last 6 months">
                <GrowthTable rows={analytics.growthChart} />
              </SectionCard>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab !== "overview" ? (
        <div>
          {sectionLoading ? (
            <AdminLoading label="Loading data…" />
          ) : sectionError ? (
            <AdminErrorState message={sectionError} />
          ) : null}

          {!sectionLoading &&
          !sectionError &&
          tab === "companies" &&
          companies ? (
            <SectionCard
              title="All companies"
              action={
                <span className="text-xs tabular-nums text-white/40">
                  {companies.length} total
                </span>
              }
            >
              <DataTable
                columns={["Company", "Plan", "Slug"]}
                rows={companies.map((c) => [
                  c.name,
                  c.subscriptionPlan || "free",
                  c.slug,
                ])}
                renderCell={(col, value) => {
                  if (col === 1) return <PlanBadge plan={value} />;
                  if (col === 0) {
                    return (
                      <span className="font-medium text-white">{value}</span>
                    );
                  }
                  return (
                    <span className="font-mono text-xs text-white/50">
                      {value}
                    </span>
                  );
                }}
              />
            </SectionCard>
          ) : null}

          {!sectionLoading && !sectionError && tab === "packages" && packages ? (
            <SectionCard title="Package catalog">
              <PackageGrid items={packages} />
            </SectionCard>
          ) : null}

          {!sectionLoading &&
          !sectionError &&
          tab === "suppliers" &&
          suppliers ? (
            <SectionCard
              title="Supplier directory"
              action={
                <span className="text-xs tabular-nums text-white/40">
                  {suppliers.length} listings
                </span>
              }
            >
              <DataTable
                columns={["Listing", "Status", "Created"]}
                rows={suppliers.map((s) => [
                  s.name,
                  s.status,
                  new Date(s.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  }),
                ])}
                renderCell={(col, value) => {
                  if (col === 1) return <StatusBadge status={value} />;
                  if (col === 0) {
                    return (
                      <span className="font-medium text-white">{value}</span>
                    );
                  }
                  return value;
                }}
              />
            </SectionCard>
          ) : null}

          {!sectionLoading && !sectionError && tab === "activity" && activity ? (
            <SectionCard title="Recent activity">
              <DataTable
                columns={["Time", "User", "Module", "Action"]}
                rows={activity.map((a) => [
                  new Date(a.createdAt).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  }),
                  a.User?.fullName || a.User?.email || "—",
                  a.module,
                  a.action,
                ])}
                renderCell={(col, value) => {
                  if (col === 2) {
                    return (
                      <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs uppercase tracking-wide text-white/60">
                        {value}
                      </span>
                    );
                  }
                  if (col === 0) {
                    return <span className="text-white/55">{value}</span>;
                  }
                  return value;
                }}
              />
            </SectionCard>
          ) : null}
        </div>
      ) : null}
    </AdminShell>
  );
}
