import type { Author, Category, Post } from "@/types/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostSlider } from "@/components/home/PostSlider";
import { ElementorChild, ElementorParent } from "@/components/ui/ElementorLayout";

type HomePopularNewsSectionProps = {
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function HomePopularNewsSection({
  posts,
  authors,
  categories,
}: HomePopularNewsSectionProps) {
  return (
    <ElementorParent id="cdd1781" className="e-con-full e-flex w-full bg-transparent py-2">
      <ElementorChild id="55cc759" className="e-con-full e-flex w-full flex-col bg-transparent">
        <SectionHeading
          title="Popular News"
          viewAllHref="/category/automation"
          headingId="3e4bb0b"
          dividerId="67bb218"
          buttonId="2457893"
        />
        <div className="relative w-full px-2 sm:px-10 lg:px-12">
          <PostSlider posts={posts} authors={authors} categories={categories} />
        </div>
      </ElementorChild>
    </ElementorParent>
  );
}
