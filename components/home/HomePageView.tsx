import type { Author, Category, Post } from "@/types/data";
import { resolveSectionPosts } from "@/lib/post-utils";
import type { HomeSectionIds } from "@/lib/home/sections";
import { HomeNewsletterBand } from "@/components/home/HomeNewsletterBand";
import { HomeHeroRecentRow } from "@/components/home/sections/HomeHeroRecentRow";
import { HomeTrendingSection } from "@/components/home/sections/HomeTrendingSection";
import { HomeContactBanner } from "@/components/home/sections/HomeContactBanner";
import { HomePopularNewsSection } from "@/components/home/sections/HomePopularNewsSection";
import { HomeLatestNewsSection } from "@/components/home/sections/HomeLatestNewsSection";
import { HomeMidGridSection } from "@/components/home/sections/HomeMidGridSection";
import { HomeTopOfWeekSection } from "@/components/home/sections/HomeTopOfWeekSection";

type HomePageViewProps = {
  sections: HomeSectionIds;
  posts: Post[];
  authors: Author[];
  categories: Category[];
  loadMoreIds: number[];
  loadMoreInitial: Post[];
  perClick: number;
};

export function HomePageView({
  sections,
  posts,
  authors,
  categories,
  loadMoreIds,
  loadMoreInitial,
  perClick,
}: HomePageViewProps) {
  const hero = resolveSectionPosts(posts, [sections.heroId], 1)[0];
  const heroAside = resolveSectionPosts(posts, sections.heroAsideIds, 2);
  const recent = resolveSectionPosts(posts, sections.recentNewsIds, 3);
  const trending = resolveSectionPosts(posts, sections.trendingIds, 6);
  const popular = resolveSectionPosts(posts, sections.popularSliderIds, 10);
  const latest = resolveSectionPosts(posts, sections.latestNewsIds, 6);
  const midGrid = resolveSectionPosts(posts, sections.midGridIds, 3);
  const sidebarPopular = resolveSectionPosts(posts, sections.sidebarPopularIds, 4);

  return (
    <div
      data-elementor-type="wp-page"
      data-elementor-id="302"
      className="elementor elementor-302 e-lazyloaded w-full max-w-full bg-transparent text-[var(--titleColor,#fff)]"
    >

      <HomeHeroRecentRow
        hero={hero}
        heroAside={heroAside}
        recent={recent}
        authors={authors}
        categories={categories}
      />
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-[40px]">
        <HomeTrendingSection posts={trending} authors={authors} categories={categories} />
        <HomeContactBanner />
        <HomePopularNewsSection posts={popular} authors={authors} categories={categories} />
        <HomeLatestNewsSection posts={latest} authors={authors} categories={categories} />
        <HomeMidGridSection posts={midGrid} authors={authors} categories={categories} />
        <HomeTopOfWeekSection
          loadMoreInitial={loadMoreInitial}
          loadMoreIds={loadMoreIds}
          perClick={perClick}
          sidebarPopular={sidebarPopular}
          authors={authors}
          categories={categories}
        />
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-[40px]">
        <HomeNewsletterBand />
      </div>



   
    </div>
  );
}
