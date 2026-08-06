import type { Metadata } from "next";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

type PageProps = {
  params: Promise<{ month: string; day: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  const pairs = Array.from(new Set(posts.map((p) => `${p.month}/${p.day}`)));
  return pairs.map((pair) => {
    const [month, day] = pair.split("/");
    return { month, day };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day } = await params;
  return { title: `Archive 2025/${month}/${day} - METALLURGY` };
}

export default async function DayArchivePage({ params }: PageProps) {
  const { month, day } = await params;
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const dayPosts = posts.filter(
    (p) => p.year === "2025" && p.month === month && p.day === day,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          Daily Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          2025 / {month} / {day}
        </h1>
        <p className="text-xs text-slate-400">
          Showing {dayPosts.length} article{dayPosts.length === 1 ? "" : "s"} published on 2025/{month}/{day}
        </p>
      </div>

      <SectionHeading title={`Articles from 2025/${month}/${day}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dayPosts.map((post) => (
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
