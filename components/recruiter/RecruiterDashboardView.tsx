"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/admin/api";
import { clearSession, readSession } from "@/lib/auth/session";

type RecruiterDashboard = {
  jobsCount: number;
  applicationsCount: number;
  directoriesCount: number;
  recentJobs: { id: number; title: string; createdAt: string }[];
  directories: { id: number; name: string; status: string }[];
  articles: { id: number; title: string; status: string }[];
};

export function RecruiterDashboardView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecruiterDashboard | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const session = readSession();
    if (!session?.token) {
      router.replace("/login");
      return;
    }
    if (session.user.role?.toLowerCase() !== "recruiter") {
      router.replace("/");
      return;
    }
    setEmail(session.user.email);

    (async () => {
      const res = await apiFetch<RecruiterDashboard>(
        "/api/recruiter/dashboard",
        session.token,
      );
      if (res.error) setError(res.error);
      else setData(res.data ?? null);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white/70">
        Loading recruiter dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-400">{error}</p>
        <Link href="/login" className="mt-4 inline-block text-[#0073ff]">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-white">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-semibold">Recruiter dashboard</h1>
          <p className="mt-1 text-sm text-white/60">{email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
          className="rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
        >
          Sign out
        </button>
      </div>

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Active jobs" value={data.jobsCount} />
            <Stat label="Applications" value={data.applicationsCount} />
            <Stat label="Directory listings" value={data.directoriesCount} />
          </div>

          <Section title="Recent jobs">
            {data.recentJobs?.length ? (
              <ul className="divide-y divide-white/5 rounded-lg border border-white/10 bg-[#171a1e]">
                {data.recentJobs.map((job) => (
                  <li key={job.id} className="px-4 py-3 text-sm">
                    {job.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/50">No jobs yet.</p>
            )}
          </Section>

          <Section title="Supplier directories">
            {data.directories?.length ? (
              <ul className="divide-y divide-white/5 rounded-lg border border-white/10 bg-[#171a1e]">
                {data.directories.map((d) => (
                  <li
                    key={d.id}
                    className="flex justify-between px-4 py-3 text-sm"
                  >
                    <span>{d.name}</span>
                    <span className="text-white/50">{d.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/50">No listings yet.</p>
            )}
          </Section>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171a1e] p-4">
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}
