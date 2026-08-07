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
    <>
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
      <div className="fpg-loadmore-wrapper col-span-full flex flex-col items-center gap-2 py-4">
        {!done && hasMore ? (
          <button
            type="button"
            className="fpg-loadmore-btn inline-flex items-center justify-center gap-2.5 rounded-md bg-[var(--primaryColor)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
            onClick={onLoadMore}
            disabled={loading}
          >
            Load More <i className="ri-loop-left-line" />
          </button>
        ) : null}
        <span
          className="fpg-load-complete-text"
          style={{ display: done || !hasMore ? undefined : "none" }}
        >
          🥰 That&apos;s all for now!
        </span>
      </div>
    </>
  );
}
