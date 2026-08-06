import type { Metadata } from "next";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

export const metadata: Metadata = {
  title: "Search Results - METALLURGY",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() || "";

  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const filteredPosts = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.categoryLabel?.toLowerCase().includes(query),
      )
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <SectionHeading title={query ? `Search Results for "${query}"` : "Search All Articles"} />
        <p className="text-xs text-slate-400">
          Found {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"} matching your search.
        </p>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
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
      ) : (
        <div className="text-center py-16 space-y-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl">
            <i className="ri-search-eye-line"></i>
          </div>
          <h3 className="text-lg font-bold text-white">No Matching Articles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for terms like &quot;AI&quot;, &quot;cloud&quot;, &quot;robotics&quot;, or &quot;software&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
