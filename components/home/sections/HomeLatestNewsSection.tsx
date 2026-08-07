import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGroup } from "@/components/ui/PostGroup";
import {
  ElementorInner,
  ElementorParent,
  ElementorWidget,
} from "@/components/ui/ElementorLayout";

type HomeLatestNewsSectionProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function HomeLatestNewsSection({
  posts,
  authors,
  categories,
}: HomeLatestNewsSectionProps) {
  return (
    <ElementorParent id="e8d8030" className="e-con-boxed e-flex w-full bg-transparent py-6">
      <ElementorInner>
        <SectionHeading
          title="Latest News"
          viewAllHref="/category/automation"
          headingId="3919127"
          dividerId="743bbac"
          buttonId="052b74c"
        />
        <ElementorWidget id="b21c767" widgetType="fpg-post-group">
          <PostGroup
            variant="two"
            total={posts.length}
            className="grid grid-cols-1 gap-[30px] lg:grid-cols-12"
          >
            {posts.slice(0, 2).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                authors={authors}
                categories={categories}
                variant="floating"
                titleTag="h3"
                cardLarge
              />
            ))}
            {posts.slice(2).map((post) => (
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
