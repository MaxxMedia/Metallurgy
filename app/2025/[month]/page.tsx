import type { Metadata } from "next";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

type PageProps = {
  params: Promise<{ month: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  const months = Array.from(new Set(posts.map((p) => p.month)));
  return months.map((month) => ({ month }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month } = await params;
  return { title: `Archive 2025/${month} - METALLURGY` };
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { month } = await params;
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const monthPosts = posts.filter(
    (p) => p.year === "2025" && p.month === month,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          Monthly Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          2025 / {month}
        </h1>
        <p className="text-xs text-slate-400">
          Showing {monthPosts.length} article{monthPosts.length === 1 ? "" : "s"} published in {month}/2025
        </p>
      </div>

      <SectionHeading title={`Articles from 2025/${month}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authors={authors}
            categories={categories}
            variant="three"
            showExcerpt
          />
        ))}
      </div>
    </div>
  );
}
