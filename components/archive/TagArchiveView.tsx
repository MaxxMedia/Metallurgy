import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGrid } from "@/components/ui/PostGrid";

type TagArchiveViewProps = {
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function TagArchiveView({
  title,
  posts,
  authors,
  categories,
}: TagArchiveViewProps) {
  return (
    <div className="elementor elementor-archive">
      <SectionHeading title={title} />
      <PostGrid>
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
      </PostGrid>
    </div>
  );
}
