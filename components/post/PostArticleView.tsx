import Link from "next/link";
import type { Author, Category, Post } from "@/types/data";
import { formatPostDate, postThumbnail } from "@/lib/post-utils";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { PostMeta } from "@/components/ui/PostMeta";

type PostArticleViewProps = {
  post: Post;
  author: Author;
  category?: Category;
};

export function PostArticleView({ post, author, category }: PostArticleViewProps) {
  const catName = category?.name ?? post.categoryLabel ?? "Tech";
  const catSlug = category?.slug ?? post.categorySlug ?? "tech-2";
  const catColor = category?.color ?? post.categoryColor ?? "#ff5733";
  const thumb = postThumbnail(post, "large");

  return (
    <article className="elementor elementor-single-post">
      <header className="fpg-post-content">
        <CategoryBadge name={catName} slug={catSlug} color={catColor} />
        <h1 className="fpg-post-title entry-title">{post.title}</h1>
        <PostMeta
          author={author}
          views={post.views}
          dateISO={post.dateISO}
          showDate
        />
      </header>
      <div className="fpg-post-thumb post-thumbnail">
        <img src={thumb} alt="" className="attachment-large size-large wp-post-image" />
      </div>
      <div className="entry-content fpg-post-content rstb-post-content">
        {post.bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        ) : (
          <>
            <p>{post.excerpt}</p>
            <p>
              <Link href={`/category/${catSlug}`}>More in {catName}</Link>
            </p>
          </>
        )}
      </div>
      <footer className="entry-footer">
        <time dateTime={post.dateISO}>{formatPostDate(post.dateISO)}</time>
      </footer>
    </article>
  );
}
