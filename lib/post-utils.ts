import type { Author, Category, Post } from "@/types/data";

import {
  sizedFromMedium,
  stockImageForPost,
  usesPlaceholderFeatured,
  DEFAULT_MEDIUM,
} from "@/lib/home-stock-images";

export const DEFAULT_THUMB = stockImageForPost(0, "thumb");

export const HOME_BANNER =
  "/wp-content/uploads/sites/32/2025/12/add_tecsh.jpg";

/** Home hero (`c8545b8`) background from the Elementor mirror. */
export const HOME_HERO_BANNER =
  "/wp-content/uploads/sites/32/2025/11/banner-bg-thumb-01-min.png";

export function postThumbnail(post: Post, size: "thumb" | "medium" | "large" = "medium"): string {
  const mapped = stockImageForPost(post.id, size);
  const src = post.featuredImage ?? DEFAULT_MEDIUM;

  if (usesPlaceholderFeatured(src)) {
    return mapped;
  }

  if (size === "thumb") {
    const thumb = sizedFromMedium(src, "thumb");
    return usesPlaceholderFeatured(thumb) ? mapped : thumb;
  }
  if (size === "large") {
    return sizedFromMedium(src, "large");
  }
  return sizedFromMedium(src, "medium");
}

export function formatPostDate(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function excerptWords(text: string, maxWords = 18): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function categoryForPost(
  post: Post,
  categories: Category[],
): Category | undefined {
  const id = post.categoryIds[0];
  return categories.find((c) => c.id === id);
}

export function authorForPost(post: Post, authors: Author[]): Author {
  return authors.find((a) => a.id === post.authorId) ?? authors[0]!;
}

export function postsByIds(posts: Post[], ids: number[]): Post[] {
  const map = new Map(posts.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is Post => Boolean(p));
}

/** Resolve section posts; pad from dated feed when featured list is short. */
export function resolveSectionPosts(
  posts: Post[],
  ids: number[],
  targetCount: number,
): Post[] {
  const picked = postsByIds(posts, ids);
  if (picked.length >= targetCount) return picked.slice(0, targetCount);
  const used = new Set(picked.map((p) => p.id));
  const sorted = [...posts].sort(
    (a, b) => Date.parse(b.dateISO) - Date.parse(a.dateISO),
  );
  for (const p of sorted) {
    if (picked.length >= targetCount) break;
    if (!used.has(p.id)) {
      picked.push(p);
      used.add(p.id);
    }
  }
  return picked;
}

export function postsForCategory(posts: Post[], categoryId: number): Post[] {
  return posts.filter((p) => p.categoryIds.includes(categoryId));
}
