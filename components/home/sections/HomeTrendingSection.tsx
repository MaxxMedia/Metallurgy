import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGroup } from "@/components/ui/PostGroup";
import {
  ElementorInner,
  ElementorParent,
  ElementorWidget,
} from "@/components/ui/ElementorLayout";

type HomeTrendingSectionProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function HomeTrendingSection({ posts, authors, categories }: HomeTrendingSectionProps) {
  return (
    <ElementorParent id="4b1b016" className="e-con-boxed e-flex w-full bg-transparent py-6">
      <ElementorInner>
        <SectionHeading
          title="Trending News"
          viewAllHref="/category/automation"
          headingId="3c53979"
          dividerId="57f0682"
          buttonId="e9d70e6"
        />
        <ElementorWidget id="ab24245" widgetType="fpg-post-group">
          <PostGroup
            variant="four"
            total={posts.length}
            className="grid grid-cols-1 gap-[30px] lg:grid-cols-3 [&>.fpg-card-style:first-child]:lg:row-span-3"
          >
            {posts[0] ? (
              <PostCard
                post={posts[0]}
                authors={authors}
                categories={categories}
                variant="floating"
                titleTag="h4"
                cardLarge
              />
            ) : null}
            {posts.slice(1).map((post) => (
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
          </PostGroup>
        </ElementorWidget>
      </ElementorInner>
    </ElementorParent>
  );
}
