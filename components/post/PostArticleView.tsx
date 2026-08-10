import Link from "next/link";
import type { Author, Category, Post } from "@/types/data";
import { formatPostDate, postThumbnail } from "@/lib/post-utils";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { PostMeta } from "@/components/ui/PostMeta";
import { PostBlockRenderer } from "./PostBlockRenderer";

type PostArticleViewProps = {
  post: Post;
  author: Author;
  category?: Category;
};

export function PostArticleView({ post, author, category }: PostArticleViewProps) {
  const catName = category?.name ?? post.categoryLabel ?? "Technology";
  const catSlug = category?.slug ?? post.categorySlug ?? "techonology";
  const catColor = category?.color ?? post.categoryColor ?? "#0073ff";
  const thumb = post.featuredImage || postThumbnail(post, "large");

  return (
    <article className="elementor elementor-single-post max-w-4xl mx-auto px-4 py-10">
      {/* Category & Badge Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <CategoryBadge name={catName} slug={catSlug} color={catColor} />
        {post.categoryLabel && post.categoryLabel !== catName && (
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-[#0073ff] border border-blue-500/20">
            {post.categoryLabel}
          </span>
        )}
      </div>

      {/* Article Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
        {post.title}
      </h1>

      {/* Author & Date Metadata */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200 dark:border-gray-800 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {(author.avatarUrl || author.avatar) ? (
            <img
              src={author.avatarUrl || author.avatar}
              alt={author.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-[#0073ff]"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-[#0073ff] text-white flex items-center justify-center font-bold text-lg">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {author.role || "Author"} • {formatPostDate(post.dateISO)}
            </p>
          </div>
        </div>

        {post.views !== undefined && (
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            <i className="ri-eye-line text-sm text-[#0073ff]" />
            <span>{post.views} Views</span>
          </div>
        )}
      </div>

      {/* Banner Image */}
      {thumb && (
        <div className="mb-10 overflow-hidden rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800">
          <img
            src={thumb}
            alt={post.title}
            className="w-full h-auto object-cover max-h-[620px] transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>
      )}

      {/* Excerpt Lead Paragraph */}
      {post.excerpt && (
        <div className="mb-8 p-6 rounded-2xl bg-blue-500/5 border-l-4 border-[#0073ff] text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed italic">
          {post.excerpt}
        </div>
      )}

      {/* Article Content / Block Builder */}
      <div className="entry-content fpg-post-content rstb-post-content text-lg leading-relaxed space-y-6">
        {post.contentBlocks && post.contentBlocks.length > 0 ? (
          <PostBlockRenderer blocks={post.contentBlocks} />
        ) : post.bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
        )}
      </div>

      {/* Author Bio Box */}
      {author.bio && (
        <div className="mt-12 p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 flex items-start gap-4">
          {(author.avatarUrl || author.avatar) && (
            <img
              src={author.avatarUrl || author.avatar}
              alt={author.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-[#0073ff] shrink-0"
            />
          )}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Written by {author.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{author.bio}</p>
          </div>
        </div>
      )}

      {/* Social & Contact Links */}
      {(post.facebookUrl || post.linkedinUrl || post.twitterUrl || post.youtubeUrl || post.email || post.whatsappNumber) && (
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-[#0b0e14] text-white shadow-xl space-y-4">
          <h4 className="font-bold text-base tracking-wide flex items-center gap-2 text-white">
            <span>🔗 Connect & Social Contact</span>
          </h4>
          <div className="flex flex-wrap gap-3 pt-1">
            {post.facebookUrl && (
              <a
                href={post.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
              >
                Facebook
              </a>
            )}
            {post.linkedinUrl && (
              <a
                href={post.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-all shadow-sm"
              >
                LinkedIn
              </a>
            )}
            {post.twitterUrl && (
              <a
                href={post.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-800 border border-white/20 text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
              >
                Twitter / X
              </a>
            )}
            {post.youtubeUrl && (
              <a
                href={post.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-all shadow-sm"
              >
                YouTube
              </a>
            )}
            {post.email && (
              <a
                href={`mailto:${post.email}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm"
              >
                ✉️ {post.email}
              </a>
            )}
            {post.whatsappNumber && (
              <a
                href={post.whatsappNumber.startsWith("http") ? post.whatsappNumber : `https://wa.me/${post.whatsappNumber.replace(/[^\d+]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-all shadow-sm"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500">
        <time dateTime={post.dateISO}>Published: {formatPostDate(post.dateISO)}</time>
        <Link href="/" className="text-[#0073ff] hover:underline font-semibold flex items-center gap-1">
          <span>← Back to Home</span>
        </Link>
      </footer>
    </article>
  );
}
