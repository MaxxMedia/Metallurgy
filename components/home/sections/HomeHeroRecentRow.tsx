import type { Author, Category, Post } from "@/types/data";
import { HOME_HERO_BANNER } from "@/lib/post-utils";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGrid } from "@/components/ui/PostGrid";
import { PostGroup } from "@/components/ui/PostGroup";
import {
  ElementorChild,
  ElementorParent,
  ElementorWidget,
} from "@/components/ui/ElementorLayout";

type HomeHeroRecentRowProps = {
  hero?: Post;
  heroAside: Post[];
  recent: Post[];
  authors: Author[];
  categories: Category[];
};

export function HomeHeroRecentRow({
  hero,
  heroAside,
  recent,
  authors,
  categories,
}: HomeHeroRecentRowProps) {
  return (
    <ElementorParent
      id="0ae4417"
      className="e-con-full e-flex flex w-full max-w-full flex-nowrap items-stretch justify-between gap-0 max-lg:flex-wrap"
      dataSettings={{ background_background: "classic" }}
    >
      <ElementorChild
        id="c8545b8"
        className="home-hero-banner e-flex e-con e-child flex min-h-[480px] min-w-0 flex-1 flex-col items-start justify-start gap-y-[60px] gap-x-[50px] overflow-x-hidden bg-cover bg-center bg-no-repeat pb-0 pl-5 pr-5 sm:min-h-[520px] sm:gap-y-[80px] sm:pl-8 md:pl-12 lg:gap-y-[120px] lg:pl-[140px] lg:pr-[50px]"
        dataSettings={{ background_background: "classic" }}
        style={
          {
            "--homeHeroBanner": `url(${HOME_HERO_BANNER})`,
            paddingTop: "clamp(112px, 11vh, 150px)",
          } as React.CSSProperties
        }
      >
        <ElementorChild
          id="624f3f5"
          className="e-con-full e-flex w-full max-w-[650px] pt-2 sm:pt-4"
        >
          <ElementorWidget id="ded5d98" widgetType="fpg-post-grid">
            <PostGrid>
              {hero ? (
                <PostCard
                  post={hero}
                  authors={authors}
                  categories={categories}
                  variant="one"
                  titleTag="h1"
                  onDarkHero
                />
              ) : null}
            </PostGrid>
          </ElementorWidget>
        </ElementorChild>
        <ElementorChild id="11aa2d4" className="e-con-full e-flex w-full max-w-[930px]">
          <ElementorWidget
            id="5d4aa55"
            widgetType="fpg-post-grid"
            dataSettings={{ thumbnail_type: "play_btn" }}
          >
            <PostGrid gridClassName="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {heroAside.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authors={authors}
                  categories={categories}
                  variant="two"
                  titleTag="h6"
                  thumbSize="thumb"
                  playButtonOnThumb
                  heroGlass
                  onDarkHero
                />
              ))}
            </PostGrid>
          </ElementorWidget>
        </ElementorChild>
      </ElementorChild>

      <ElementorChild
        id="8e9f4c7"
        className="e-con-full e-flex e-con e-child flex w-full min-w-0 max-w-[530px] shrink-0 flex-col self-stretch bg-[var(--e-global-color-7c24774,#171A1E)] px-4 pb-5 sm:px-5 max-lg:max-w-full max-xl:max-w-[400px]"
        style={{ paddingTop: "clamp(112px, 11vh, 150px)" } as React.CSSProperties}
      >
        <ElementorChild
          id="70364f7"
          className="e-con-full flex w-full flex-row flex-nowrap items-center justify-between"
        >
          <SectionHeading
            title="Recent News"
            viewAllHref="/category/tech"
            level="h4"
            headingId="67a666a"
            buttonId="239add3"
            showDivider={false}
            viewAllWithIcon
          />
        </ElementorChild>
        <ElementorWidget id="e5338fb" widgetType="fpg-post-group">
          <PostGroup
            variant="four"
            total={recent.length}
            className="grid grid-cols-1 gap-5 [&>.fpg-card-style.style-floating.card-large]:min-h-[260px] sm:[&>.fpg-card-style.style-floating.card-large]:min-h-[280px]"
          >
            {recent[0] ? (
              <PostCard
                post={recent[0]}
                authors={authors}
                categories={categories}
                variant="floating"
                titleTag="h4"
                cardLarge
                showCategory={false}
              />
            ) : null}
            {recent.slice(1).map((post) => (
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
      </ElementorChild>
    </ElementorParent>
  );
}
