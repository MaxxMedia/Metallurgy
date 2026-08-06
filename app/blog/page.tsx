import type { Metadata } from "next";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

export const metadata: Metadata = {
  title: "Blog - Latest Technology News & Articles",
  description: "Browse all latest technology, software, AI, and robotics articles on METALLURGY.",
};

export default async function BlogPage() {
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SectionHeading title="All Articles &amp; News" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
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
