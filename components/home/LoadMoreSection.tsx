"use client";

import { useState } from "react";
import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/fpg/PostCard";

type LoadMoreSectionProps = {
  initialPosts: Post[];
  authors: Author[];
  categories: Category[];
  perClick: number;
  totalIds: number[];
};

export function LoadMoreSection({
  initialPosts,
  authors,
  categories,
  perClick,
  totalIds,
}: LoadMoreSectionProps) {
  const [extra, setExtra] = useState<Post[]>([]);
  const [offset, setOffset] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initialPosts.length >= totalIds.length);

  const allShown = [...initialPosts, ...extra];
  const hasMore = offset < totalIds.length;

  const onLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/home/load-more?offset=${offset}&limit=${perClick}`,
      );
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { posts: Post[]; hasMore: boolean };
      setExtra((prev) => [...prev, ...data.posts]);
      setOffset((o) => o + perClick);
      if (!data.hasMore) setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allShown.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authors={authors}
            categories={categories}
            variant="three"
            titleTag="h4"
            showExcerpt
          />
        ))}
      </div>

      <div className="text-center pt-4">
        {!done && hasMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-white font-bold text-sm hover:text-emerald-400 transition-all shadow-lg disabled:opacity-50"
          >
            <span>{loading ? "Loading..." : "Load More Articles"}</span>
            <i className={`ri-refresh-line ${loading ? "animate-spin" : ""}`}></i>
          </button>
        ) : (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest py-3">
            ✨ You&apos;ve reached the end of this list
          </p>
        )}
      </div>
    </div>
  );
}
