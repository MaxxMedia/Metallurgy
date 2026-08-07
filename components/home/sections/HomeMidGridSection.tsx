import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { PostGrid } from "@/components/ui/PostGrid";
import {
  ElementorChild,
  ElementorInner,
  ElementorParent,
  ElementorWidget,
} from "@/components/ui/ElementorLayout";

type HomeMidGridSectionProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function HomeMidGridSection({ posts, authors, categories }: HomeMidGridSectionProps) {
  return (
    <ElementorParent id="802a803" className="e-con-boxed e-flex w-full bg-transparent py-4">
      <ElementorInner>
        <ElementorChild id="925f873" className="e-con-full e-flex">
          <ElementorChild id="2eddd47" className="e-con-full e-flex">
            {null}
          </ElementorChild>
          <ElementorWidget id="0255ec1" widgetType="fpg-post-grid">
            <PostGrid
              parentClassName="[&_.fpg-post-grid]:grid [&_.fpg-post-grid]:gap-[30px]"
              gridClassName="grid gap-[30px]"
            >
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authors={authors}
                  categories={categories}
                  variant="two"
                  titleTag="h6"
                  thumbSize="thumb"
                />
              ))}
            </PostGrid>
          </ElementorWidget>
        </ElementorChild>
      </ElementorInner>
    </ElementorParent>
  );
}
