import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGrid } from "@/components/ui/PostGrid";

type CategoryArchiveViewProps = {
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
  showSectionHeading?: boolean;
};

export function CategoryArchiveView({
  title,
  posts,
  authors,
  categories,
  showSectionHeading = true,
}: CategoryArchiveViewProps) {
  return (
    <div className="elementor elementor-archive w-full">
      {showSectionHeading ? <SectionHeading title={title} /> : null}
      <PostGrid gridClassName="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
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
