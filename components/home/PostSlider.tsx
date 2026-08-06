"use client";

import { useRef } from "react";
import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/fpg/PostCard";

type PostSliderProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function PostSlider({ posts, authors, categories }: PostSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/slider my-6">
      {/* Controls */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-all"
        aria-label="Previous"
      >
        <i className="ri-arrow-left-s-line text-xl"></i>
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 hover:scale-110 transition-all"
        aria-label="Next"
      >
        <i className="ri-arrow-right-s-line text-xl"></i>
      </button>

      {/* Slider Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex-shrink-0 w-72 sm:w-80 snap-start"
          >
            <PostCard
              post={post}
              authors={authors}
              categories={categories}
              variant="floating"
              titleTag="h5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
