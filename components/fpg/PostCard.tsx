import Link from "next/link";
import type { Author, Category, Post } from "@/types/data";
import {
  authorForPost,
  categoryForPost,
  excerptWords,
  postThumbnail,
} from "@/lib/post-utils";
import { CategoryBadge } from "@/components/fpg/CategoryBadge";
import { PostMeta } from "@/components/fpg/PostMeta";

type PostCardProps = {
  post: Post;
  authors: Author[];
  categories: Category[];
  variant: "one" | "two" | "three" | "floating";
  titleTag?: "h1" | "h3" | "h4" | "h5" | "h6";
  showExcerpt?: boolean;
  thumbSize?: "thumb" | "medium" | "large";
  cardLarge?: boolean;
  showCategory?: boolean;
  playButtonOnThumb?: boolean;
};

export function PostCard({
  post,
  authors,
  categories,
  variant,
  showExcerpt = false,
  thumbSize = "medium",
  cardLarge = false,
  showCategory = true,
  playButtonOnThumb = false,
}: PostCardProps) {
  const author = authorForPost(post, authors);
  const category = categoryForPost(post, categories);
  const catName = category?.name ?? post.categoryLabel ?? "Tech";
  const catSlug = category?.slug ?? post.categorySlug ?? "tech-2";
  const catColor = category?.color ?? post.categoryColor ?? "#10b981";
  const thumb = postThumbnail(
    post,
    thumbSize === "medium" ? "medium" : cardLarge ? "large" : thumbSize,
  );

  if (variant === "floating") {
    return (
      <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-emerald-900/10">
        <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden">
          <Link href={post.url} className="block w-full h-full">
            <img
              src={thumb}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none"></div>
          {playButtonOnThumb && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <i className="ri-play-fill text-xl"></i>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 p-5 space-y-2.5 z-10">
          {showCategory && (
            <CategoryBadge name={catName} slug={catSlug} color={catColor} />
          )}
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            <Link href={post.url}>{post.title}</Link>
          </h3>
          <PostMeta
            author={author}
            views={post.views}
            dateISO={post.dateISO}
            showDate
          />
        </div>
      </div>
    );
  }

  if (variant === "two") {
    return (
      <div className="flex gap-4 items-center group p-2.5 rounded-xl border border-slate-800/60 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200">
        <Link
          href={post.url}
          className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50"
        >
          <img
            src={thumb}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {playButtonOnThumb && (
            <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs shadow-sm">
                <i className="ri-play-fill"></i>
              </div>
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0 space-y-1.5">
          {showCategory && (
            <CategoryBadge name={catName} slug={catSlug} color={catColor} />
          )}
          <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            <Link href={post.url}>{post.title}</Link>
          </h4>
          <PostMeta author={author} views={post.views} />
        </div>
      </div>
    );
  }

  // Variant "one" or "three" (Standard Card / Hero Featured Card)
  return (
    <div className="group flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 shadow-lg">
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-800">
        <Link href={post.url} className="block w-full h-full">
          <img
            src={thumb}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {showCategory && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge name={catName} slug={catSlug} color={catColor} />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            <Link href={post.url}>{post.title}</Link>
          </h3>
          {showExcerpt && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {excerptWords(post.excerpt || post.title, 18)}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <PostMeta
            author={author}
            views={post.views}
            dateISO={post.dateISO}
            showDate
          />
          <Link
            href={post.url}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group/link"
          >
            Read <i className="ri-arrow-right-line group-hover/link:translate-x-0.5 transition-transform"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
