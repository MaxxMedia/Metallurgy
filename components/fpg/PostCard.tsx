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
  titleTag: TitleTag = "h4",
  showExcerpt = false,
  thumbSize = "medium",
  cardLarge = false,
  showCategory,
  playButtonOnThumb = false,
}: PostCardProps) {
  const author = authorForPost(post, authors);
  const category = categoryForPost(post, categories);
  const catName = category?.name ?? post.categoryLabel ?? "Tech";
  const catSlug = category?.slug ?? post.categorySlug ?? "tech-2";
  const catColor = category?.color ?? post.categoryColor ?? "#ff5733";
  const thumb = postThumbnail(
    post,
    thumbSize === "medium" ? "medium" : cardLarge ? "large" : thumbSize,
  );

  const imgClass =
    cardLarge || thumbSize === "large"
      ? "attachment-large size-large wp-post-image"
      : thumbSize === "thumb"
        ? "attachment-thumbnail size-thumbnail wp-post-image"
        : "attachment-medium_large size-medium_large wp-post-image";

  const styleClass =
    variant === "floating"
      ? `fpg-card-style style-floating${cardLarge ? " card-large" : ""}`
      : `fpg-card-style style-${variant}`;

  const showCatBadge = showCategory ?? true;

  return (
    <div className={styleClass}>
      {variant !== "one" ? (
        <div className={`fpg-post-thumb${playButtonOnThumb ? " thumb-type-play_btn" : ""}`}>
          <Link href={post.url} className="image-link">
            <img
              loading="lazy"
              decoding="async"
              src={thumb}
              className={imgClass}
              alt=""
            />
          </Link>
          {playButtonOnThumb ? (
            <a href={post.url} className="fpg-play-btn" aria-label="Play">
              <i className="ri-play-fill" />
            </a>
          ) : null}
          {variant === "floating" ? <div className="thumb-overlay" /> : null}
        </div>
      ) : null}
      <div className="fpg-post-content">
        <div className="fpg-post-content-inner">
          {showCatBadge ? (
            <CategoryBadge name={catName} slug={catSlug} color={catColor} />
          ) : null}
          <TitleTag className="fpg-post-title">
            <Link href={post.url}>{post.title}</Link>
          </TitleTag>
          {showExcerpt ? (
            <p className="fpg-post-excerpt">
              {excerptWords(post.excerpt || post.title)}
            </p>
          ) : null}
        </div>
        <PostMeta
          author={author}
          views={post.views}
          dateISO={post.dateISO}
          showDate={variant === "one" || variant === "three" || variant === "floating"}
        />
        {variant === "one" ? (
          <div className="fpg-btn-wrapper">
            <Link href={post.url}> Read Article </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
