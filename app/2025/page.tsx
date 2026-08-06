import type { Metadata } from "next";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

export const metadata: Metadata = {
  title: "2025 Archives - METALLURGY",
};

export default async function YearArchivePage() {
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const yearPosts = posts.filter((p) => p.year === "2025");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          Year Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          2025 Articles
        </h1>
        <p className="text-xs text-slate-400">
          Showing {yearPosts.length} article{yearPosts.length === 1 ? "" : "s"} published in 2025
        </p>
      </div>

      <SectionHeading title="2025 News Feed" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yearPosts.map((post) => (
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
