import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGrid } from "@/components/ui/PostGrid";
import { ElementorWidget } from "@/components/ui/ElementorLayout";

type CategoryArchiveViewProps = {
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
  showSectionHeading?: boolean;
  /** Match archive Elementor export (single-column style-three grid). */
  elementorPostGrid?: { widgetId: string };
};

export function CategoryArchiveView({
  title,
  posts,
  authors,
  categories,
  showSectionHeading = true,
  elementorPostGrid,
}: CategoryArchiveViewProps) {
  const grid = (
    <PostGrid
      gridClassName={elementorPostGrid ? "" : "grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3"}
    >
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
  );

  if (elementorPostGrid) {
    return (
      <ElementorWidget
        id={elementorPostGrid.widgetId}
        widgetType="fpg-post-grid"
        dataSettings={{ thumbnail_type: "image" }}
      >
        {grid}
      </ElementorWidget>
    );
  }

  return (
    <div className="elementor elementor-archive w-full">
      {showSectionHeading ? <SectionHeading title={title} /> : null}
      {grid}
    </div>
  );
}
