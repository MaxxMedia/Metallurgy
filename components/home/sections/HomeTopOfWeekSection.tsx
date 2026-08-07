import type { Author, Category, Post } from "@/types/data";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGrid } from "@/components/ui/PostGrid";
import { LoadMoreSection } from "@/components/home/LoadMoreSection";
import { HomeExploreCategories } from "@/components/home/HomeExploreCategories";
import { HomeSidebarFollow } from "@/components/home/HomeSidebarFollow";
import {
  ElementorChild,
  ElementorInner,
  ElementorParent,
  ElementorWidget,
} from "@/components/ui/ElementorLayout";

type HomeTopOfWeekSectionProps = {
  loadMoreInitial: Post[];
  loadMoreIds: number[];
  perClick: number;
  sidebarPopular: Post[];
  authors: Author[];
  categories: Category[];
};

export function HomeTopOfWeekSection({
  loadMoreInitial,
  loadMoreIds,
  perClick,
  sidebarPopular,
  authors,
  categories,
}: HomeTopOfWeekSectionProps) {
  return (
    <ElementorParent id="eff206a" className="e-con-boxed e-flex w-full bg-transparent py-6">
      <ElementorInner>
        <ElementorChild id="a4cf690" className="e-con-full e-flex">
          <ElementorChild
            id="c03d65c"
            className="e-con-full flex flex-wrap items-start gap-8 lg:flex-nowrap"
          >
            <ElementorChild id="4849007" className="e-con-full e-flex min-w-0 max-w-full flex-1">
              <SectionHeading
                title="Top of This Week"
                headingId="3e4b460"
                dividerId="426dc0b"
              />
              <ElementorWidget
                id="676dbe6"
                widgetType="fpg-post-grid"
                dataSettings={{ thumbnail_type: "image" }}
              >
                <PostGrid
                  parentClassName="[&_.fpg-post-grid]:grid [&_.fpg-post-grid]:gap-[30px]"
                  gridClassName="fpg-ajax grid gap-[30px] sm:grid-cols-2"
                >
                  <LoadMoreSection
                    initialPosts={loadMoreInitial}
                    authors={authors}
                    categories={categories}
                    perClick={perClick}
                    totalIds={loadMoreIds}
                  />
                </PostGrid>
              </ElementorWidget>
            </ElementorChild>

            <ElementorChild
              id="ca280db"
              className="e-con-full e-flex flex w-full max-w-[400px] shrink-0 flex-col items-stretch justify-start gap-5 self-start max-lg:max-w-full"
              dataSettings={{ background_background: "classic" }}
            >
              <HomeExploreCategories categories={categories} />

              <ElementorChild
                id="08e5b41"
                className="e-con-full e-flex"
                dataSettings={{ background_background: "classic" }}
              >
                <ElementorWidget id="d7cf0ea" widgetType="heading" bareContainer>
                  <h4 className="elementor-heading-title elementor-size-default">Popular News</h4>
                </ElementorWidget>
                <ElementorWidget id="c7e4c3e" widgetType="fpg-post-grid">
                  <PostGrid
                    parentClassName="[&_.fpg-post-grid]:grid [&_.fpg-post-grid]:gap-[30px]"
                    gridClassName="grid gap-[30px]"
                  >
                    {sidebarPopular.map((post) => (
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
              <HomeSidebarFollow />
            </ElementorChild>
          </ElementorChild>
        </ElementorChild>
      </ElementorInner>
    </ElementorParent>
  );
}
