"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  AdminLoading,
  AdminPageHeader,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/admin/admin-ui";
import {
  USER_TAB_COPY,
  UserDashboardShell,
  type UserTab,
} from "@/components/user/UserDashboardShell";
import { apiFetch } from "@/lib/admin/api";
import { isAdminRole, readSession } from "@/lib/auth/session";

type CandidateProfile = {
  id: number;
  email: string;
  username: string;
  fullName: string | null;
  headline: string | null;
  location: string | null;
  about: string | null;
  isOnboarded: boolean;
  avatarUrl: string | null;
  skills?: { id: number }[];
  experiences?: { id: number }[];
  education?: { id: number }[];
};

type Readiness = {
  isReady: boolean;
  missingFields: string[];
  message: string;
};

type ApplicationRow = {
  id: number;
  status: string;
  createdAt: string;
  Job?: {
    title: string;
    Company?: { name: string };
  };
};

type SavedJobRow = {
  id: number;
  createdAt: string;
  Job?: {
    title: string;
    location?: string;
    Company?: { name: string };
  };
};

export function UserDashboardView() {
  const router = useRouter();
  const [tab, setTab] = useState<UserTab>("overview");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [applications, setApplications] = useState<ApplicationRow[] | null>(
    null,
  );
  const [savedJobs, setSavedJobs] = useState<SavedJobRow[] | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (!session?.token) {
      router.replace("/login");
      return;
    }
    const role = session.user.role?.toLowerCase();
    if (isAdminRole(role)) {
      router.replace("/admin");
      return;
    }
    if (role === "recruiter") {
      router.replace("/recruiter");
      return;
    }
    if (role !== "candidate") {
      router.replace("/");
      return;
    }

    setToken(session.token);

    (async () => {
      const [profileRes, readyRes, appsRes, savedRes] = await Promise.all([
        apiFetch<CandidateProfile>("/api/candidates/me", session.token),
        apiFetch<Readiness>(
          "/api/candidates/me/application-readiness",
          session.token,
        ),
        apiFetch<ApplicationRow[]>("/api/applications/me", session.token),
        apiFetch<SavedJobRow[]>("/api/jobs/saved/me", session.token),
      ]);

      if (profileRes.error) setError(profileRes.error);
      else setProfile(profileRes.data ?? null);
      if (!readyRes.error && readyRes.data) setReadiness(readyRes.data);
      if (!appsRes.error && appsRes.data) {
        setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      } else setApplications([]);
      if (!savedRes.error && savedRes.data) {
        setSavedJobs(Array.isArray(savedRes.data) ? savedRes.data : []);
      } else setSavedJobs([]);

      setLoading(false);
    })();
  }, [router]);

  const refreshTab = useCallback(
    async (next: UserTab) => {
      if (!token) return;
      if (next === "applications" && applications === null) {
        setSectionLoading(true);
        const res = await apiFetch<ApplicationRow[]>(
          "/api/applications/me",
          token,
        );
        setApplications(Array.isArray(res.data) ? res.data : []);
        setSectionLoading(false);
      }
      if (next === "saved" && savedJobs === null) {
        setSectionLoading(true);
        const res = await apiFetch<SavedJobRow[]>("/api/jobs/saved/me", token);
        setSavedJobs(Array.isArray(res.data) ? res.data : []);
        setSectionLoading(false);
      }
    },
    [token, applications, savedJobs],
  );

  useEffect(() => {
    void refreshTab(tab);
  }, [tab, refreshTab]);

  if (loading) {
    return (
      <div className="user-dashboard">
        <AdminLoading label="Loading your dashboard…" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-white">
        <p className="text-red-400">{error || "Could not load profile."}</p>
        <Link href="/login" className="mt-4 inline-block text-[#0073ff]">
          Back to login
        </Link>
      </div>
    );
  }

  const displayName = profile.fullName || profile.username || profile.email;
  const copy = USER_TAB_COPY[tab];
  const apps = applications ?? [];
  const saved = savedJobs ?? [];
  const profileScore = computeProfileScore(profile, readiness);
  const skillsCount = profile.skills?.length ?? 0;
  const expCount = profile.experiences?.length ?? 0;

  return (
    <UserDashboardShell
      email={profile.email}
      displayName={displayName}
      tab={tab}
      onTabChange={setTab}
      onSignOut={() => router.push("/login")}
    >
      <div className="rounded-2xl border border-white/[0.07] bg-[#101318]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:p-8">
        <AdminPageHeader title={copy.title} description={copy.description} />

        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Profile strength"
                value={`${profileScore}%`}
                icon="ri-user-star-line"
                hint={readiness?.isReady ? "Ready to apply" : "Needs attention"}
                accent={readiness?.isReady ? "#22c55e" : "#f59e0b"}
              />
              <StatCard
                label="Applications"
                value={apps.length}
                icon="ri-send-plane-line"
                accent="#0073ff"
              />
              <StatCard
                label="Saved jobs"
                value={saved.length}
                icon="ri-bookmark-2-line"
                accent="#6366f1"
              />
              <StatCard
                label="Experience entries"
                value={expCount}
                icon="ri-briefcase-line"
                hint={`${skillsCount} skills listed`}
                accent="#14b8a6"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              <SectionCard title="Profile completion">
                <ProfileRing score={profileScore} />
                {!readiness?.isReady && readiness?.missingFields.length ? (
                  <ul className="mt-4 space-y-2">
                    {readiness.missingFields.map((field) => (
                      <li
                        key={field}
                        className="flex items-center gap-2 text-sm text-white/55"
                      >
                        <i className="ri-close-circle-line text-amber-400" aria-hidden />
                        {field}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-emerald-400/90">
                    {readiness?.message ?? "You're all set to apply."}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setTab("profile")}
                  className="mt-5 text-sm font-medium text-[#0073ff] hover:underline"
                >
                  View full profile →
                </button>
              </SectionCard>

              <div className="lg:col-span-3">
                <SectionCard
                  title="Recent applications"
                  action={
                    apps.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setTab("applications")}
                        className="text-xs text-[#0073ff] hover:underline"
                      >
                        View all
                      </button>
                    ) : null
                  }
                >
                  {apps.length === 0 ? (
                    <EmptyHint
                      icon="ri-inbox-line"
                      text="No applications yet."
                      actionLabel="Browse opportunities"
                      actionHref="/"
                    />
                  ) : (
                    <ul className="divide-y divide-white/[0.06]">
                      {apps.slice(0, 4).map((app) => (
                        <li
                          key={app.id}
                          className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {app.Job?.title ?? "Job"}
                            </p>
                            <p className="text-xs text-white/45">
                              {app.Job?.Company?.name ?? "Company"} ·{" "}
                              {formatDate(app.createdAt)}
                            </p>
                          </div>
                          <StatusBadge status={app.status || "submitted"} />
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>
              </div>
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Personal information">
              <ProfileGrid
                rows={[
                  ["Full name", profile.fullName || "—"],
                  ["Username", profile.username],
                  ["Email", profile.email],
                  ["Location", profile.location || "—"],
                  ["Headline", profile.headline || "—"],
                  [
                    "Onboarding",
                    profile.isOnboarded ? "Complete" : "Incomplete",
                  ],
                ]}
              />
            </SectionCard>
            <SectionCard title="About">
              {profile.about ? (
                <p className="text-sm leading-relaxed text-white/70">
                  {profile.about}
                </p>
              ) : (
                <p className="text-sm text-white/45">
                  Add a short bio so recruiters know who you are.
                </p>
              )}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <MiniStat label="Skills" value={skillsCount} />
                <MiniStat label="Experience" value={expCount} />
                <MiniStat
                  label="Education"
                  value={profile.education?.length ?? 0}
                />
              </div>
            </SectionCard>
          </div>
        )}

        {tab === "applications" && (
          <>
            {sectionLoading ? (
              <AdminLoading label="Loading applications…" />
            ) : apps.length === 0 ? (
              <EmptyHint
                icon="ri-file-list-3-line"
                text="You haven't applied to any jobs yet."
                actionLabel="Find jobs on the homepage"
                actionHref="/"
              />
            ) : (
              <SectionCard title={`${apps.length} application(s)`}>
                <ul className="divide-y divide-white/[0.06]">
                  {apps.map((app) => (
                    <li
                      key={app.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {app.Job?.title ?? `Application #${app.id}`}
                        </p>
                        <p className="text-sm text-white/45">
                          {app.Job?.Company?.name ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={app.status || "pending"} />
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </>
        )}

        {tab === "saved" && (
          <>
            {sectionLoading ? (
              <AdminLoading label="Loading saved jobs…" />
            ) : saved.length === 0 ? (
              <EmptyHint
                icon="ri-bookmark-line"
                text="No saved jobs yet."
                actionLabel="Explore the site"
                actionHref="/"
              />
            ) : (
              <SectionCard title={`${saved.length} saved job(s)`}>
                <ul className="divide-y divide-white/[0.06]">
                  {saved.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {row.Job?.title ?? "Job"}
                        </p>
                        <p className="text-sm text-white/45">
                          {row.Job?.Company?.name ?? "—"}
                          {row.Job?.location ? ` · ${row.Job.location}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          Saved {formatDate(row.createdAt)}
                        </p>
                      </div>
                      <i
                        className="ri-bookmark-fill text-lg text-[#0073ff]"
                        aria-hidden
                      />
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </>
        )}
      </div>
    </UserDashboardShell>
  );
}

function computeProfileScore(
  profile: CandidateProfile,
  readiness: Readiness | null,
): number {
  let score = 20;
  if (profile.fullName) score += 20;
  if (profile.headline) score += 10;
  if (profile.location) score += 10;
  if (profile.about) score += 10;
  if (profile.isOnboarded) score += 10;
  if ((profile.skills?.length ?? 0) > 0) score += 10;
  if ((profile.experiences?.length ?? 0) > 0) score += 10;
  if (readiness?.isReady) score = Math.max(score, 90);
  else if (readiness?.missingFields.length) {
    score = Math.min(score, 85 - readiness.missingFields.length * 12);
  }
  return Math.max(0, Math.min(100, score));
}

function ProfileRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" className="-rotate-90" aria-hidden>
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#0073ff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div>
        <p className="text-3xl font-semibold tabular-nums text-white">{score}%</p>
        <p className="text-sm text-white/45">Overall completeness</p>
      </div>
    </div>
  );
}

function ProfileGrid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="space-y-0">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col gap-0.5 border-b border-white/[0.05] py-3 sm:flex-row sm:justify-between sm:gap-4"
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-white/40">
            {label}
          </dt>
          <dd className="text-sm font-medium text-white/90 sm:text-right">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-center">
      <p className="text-lg font-semibold tabular-nums text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
    </div>
  );
}

function EmptyHint({
  icon,
  text,
  actionLabel,
  actionHref,
}: {
  icon: string;
  text: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-2xl text-white/30">
        <i className={icon} aria-hidden />
      </span>
      <p className="text-sm text-white/50">{text}</p>
      <Link
        href={actionHref}
        className="mt-4 rounded-lg bg-[#0073ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#0062d9]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
}
