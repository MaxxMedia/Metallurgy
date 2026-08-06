import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

type CategoryArchiveViewProps = {
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function CategoryArchiveView({
  title,
  posts,
  authors,
  categories,
}: CategoryArchiveViewProps) {
  return (
    <div className="elementor elementor-archive">
      <SectionHeading title={title} />
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
