import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

type AuthorArchiveViewProps = {
  author: Author;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function AuthorArchiveView({
  author,
  posts,
  authors,
  categories,
}: AuthorArchiveViewProps) {
  return (
    <div className="elementor elementor-archive">
      <SectionHeading title={author.name} />
      <div className="fpg-post-parent">
        <div className="fpg-post-grid">
          {posts.map((post) => (
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
      </div>
    </div>
  );
}
