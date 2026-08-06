"use client";

import Link from "next/link";
import type { Author, Category, Post } from "@/types/data";
import { formatPostDate, postThumbnail } from "@/lib/post-utils";
import { CategoryBadge } from "@/components/fpg/CategoryBadge";
import { PostMeta } from "@/components/fpg/PostMeta";

type PostArticleViewProps = {
  post: Post;
  author: Author;
  category?: Category;
};

export function PostArticleView({ post, author, category }: PostArticleViewProps) {
  const catName = category?.name ?? post.categoryLabel ?? "Tech";
  const catSlug = category?.slug ?? post.categorySlug ?? "tech-2";
  const catColor = category?.color ?? post.categoryColor ?? "#10b981";
  const thumb = postThumbnail(post, "large");

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-4 text-center sm:text-left">
        <CategoryBadge name={catName} slug={catSlug} color={catColor} />
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-b border-slate-800 pb-4">
          <PostMeta
            author={author}
            views={post.views}
            dateISO={post.dateISO}
            showDate
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Share:</span>
            <button className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors flex items-center justify-center">
              <i className="ri-twitter-x-line text-xs"></i>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors flex items-center justify-center">
              <i className="ri-facebook-fill text-xs"></i>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors flex items-center justify-center">
              <i className="ri-link-m text-xs"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Thumbnail */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900 aspect-video">
        <img
          src={thumb}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-base leading-relaxed">
        <p className="text-lg font-medium text-slate-200 leading-relaxed border-l-4 border-emerald-500 pl-4 py-1 bg-slate-900/40 rounded-r-lg">
          {post.excerpt}
        </p>

        <p>
          Technology continues to transform modern industry at an unprecedented velocity. From cloud architectures to autonomous systems and automated workflows, staying abreast of recent breakthroughs is critical for businesses and innovators worldwide.
        </p>

        <p>
          Our in-depth reporting delivers factual, reliable analysis aimed at simplifying complex technological challenges. We evaluate market trends, infrastructure capabilities, and emerging software paradigms to bring you actionable insights.
        </p>

        <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Explore Related Topics
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Read more analysis in the {catName} section.
            </p>
          </div>
          <Link
            href={`/category/${catSlug}`}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
          >
            View {catName}
          </Link>
        </div>
      </div>

      {/* Author Bio Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-md">
          {author.name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">{author.name}</h4>
          <p className="text-xs text-slate-400">
            Technology journalist &amp; industry researcher at METALLURGY.
          </p>
          <p className="text-[11px] text-slate-500">
            Published on {formatPostDate(post.dateISO)}
          </p>
        </div>
      </div>
    </article>
  );
}
