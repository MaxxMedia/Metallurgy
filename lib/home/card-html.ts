import type { Author, Category, Post } from "@/types/data";

const DEFAULT_THUMB =
  "/wp-content/uploads/sites/32/2025/10/tech_12-min-768x381.jpg";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPostDate(dateISO: string): string {
  const d = new Date(dateISO);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function excerptWords(text: string, maxWords = 18): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function postThumbnail(post: Post): string {
  if (post.featuredImage) {
    if (post.featuredImage.includes("-768x")) return post.featuredImage;
    const base = post.featuredImage.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    return `${base}-768x381.jpg`;
  }
  return DEFAULT_THUMB;
}

function categoryForPost(post: Post, categories: Category[]): Category | undefined {
  const id = post.categoryIds[0];
  return categories.find((c) => c.id === id);
}

export function renderStyleThreeCard(
  post: Post,
  author: Author,
  category: Category | undefined,
): string {
  const catName = category?.name ?? post.categoryLabel ?? "Tech";
  const catSlug = category?.slug ?? post.categorySlug ?? "tech-2";
  const catColor = category?.color ?? post.categoryColor ?? "#ff5733";
  const views = post.views ?? 40;
  const thumb = postThumbnail(post);
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(excerptWords(post.excerpt || post.title));
  const date = formatPostDate(post.dateISO);

  return `<div class="fpg-card-style style-three"><div class="fpg-post-thumb"> <a href="${post.url}" class="image-link"> <img loading="lazy" decoding="async" width="768" height="381" src="${thumb}" class="attachment-medium_large size-medium_large wp-post-image" alt="" /> </a></div><div class="fpg-post-content"><div class="fpg-post-cat"> <a href="/category/${catSlug}"
 class="post-cat"
 style="--catCurrentBgColor: ${catColor};--catCurrentColor: #ffffff;"> ${escapeHtml(catName)} </a></div><h4 class="fpg-post-title "><a href="${post.url}">${title}</a></h4><p class="fpg-post-excerpt">${excerpt}</p></div><ul class="fpg-post-meta"><li><span class="fpg-meta"> <span>By <a href="${author.url}" class="fpg-author-link">${escapeHtml(author.name)}</a></span></span></li><li><span class="fpg-meta"><i class="ri-pulse-fill"></i> ${views} Views</span></li><li><span class="fpg-meta"><i class="ri-calendar-line"></i> ${date}</span></li></ul></div>`;
}

export function renderLoadMoreCards(
  posts: Post[],
  authors: Author[],
  categories: Category[],
): string {
  return posts
    .map((post) => {
      const author =
        authors.find((a) => a.id === post.authorId) ?? authors[0]!;
      return renderStyleThreeCard(
        post,
        author,
        categoryForPost(post, categories),
      );
    })
    .join("");
}
