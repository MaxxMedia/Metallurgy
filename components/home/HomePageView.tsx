import Link from "next/link";
import type { Author, Category, Post } from "@/types/data";
import { HOME_BANNER, resolveSectionPosts } from "@/lib/post-utils";
import type { HomeSectionIds } from "@/lib/home/sections";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";
import { PostSlider } from "@/components/home/PostSlider";
import { LoadMoreSection } from "@/components/home/LoadMoreSection";
import { HomeExploreCategories } from "@/components/home/HomeExploreCategories";
import { HomeSidebarFollow } from "@/components/home/HomeSidebarFollow";
import { HomeNewsletterBand } from "@/components/home/HomeNewsletterBand";

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
  const sidebarPopular = resolveSectionPosts(posts, sections.sidebarPopularIds, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero & Recent News Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Hero Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {hero && (
            <PostCard
              post={hero}
              authors={authors}
              categories={categories}
              variant="floating"
              cardLarge
            />
          )}

          {/* Sub-hero two-column cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {heroAside.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                authors={authors}
                categories={categories}
                variant="two"
                playButtonOnThumb
              />
            ))}
          </div>
        </div>

        {/* Recent News Sidebar Column (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          <SectionHeading
            title="Recent News"
            viewAllHref="/category/tech"
          />

          <div className="space-y-3">
            {recent[0] && (
              <PostCard
                post={recent[0]}
                authors={authors}
                categories={categories}
                variant="floating"
                showCategory={false}
              />
            )}
            {recent.slice(1).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                authors={authors}
                categories={categories}
                variant="two"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending News Grid */}
      <section className="space-y-6">
        <SectionHeading
          title="Trending News"
          viewAllHref="/category/automation"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map((post, idx) => (
            <PostCard
              key={post.id}
              post={post}
              authors={authors}
              categories={categories}
              variant={idx === 0 ? "floating" : "two"}
            />
          ))}
        </div>
      </section>

      {/* Full-width Promo Banner */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors shadow-xl">
        <Link href="/contact" className="block">
          <img
            src={HOME_BANNER}
            alt="Contact us banner"
            className="w-full h-auto object-cover"
          />
        </Link>
      </section>

      {/* Popular News Carousel */}
      <section className="space-y-4">
        <SectionHeading
          title="Popular News"
          viewAllHref="/category/automation"
        />
        <PostSlider posts={popular} authors={authors} categories={categories} />
      </section>

      {/* Latest News Grid */}
      <section className="space-y-6">
        <SectionHeading
          title="Latest News"
          viewAllHref="/category/automation"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latest.slice(0, 2).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authors={authors}
              categories={categories}
              variant="floating"
              cardLarge
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {latest.slice(2).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authors={authors}
              categories={categories}
              variant="two"
            />
          ))}
        </div>
      </section>

      {/* Main Content + Sticky Sidebar (Top of This Week Feed) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-6">
          <SectionHeading title="Top of This Week" />
          <LoadMoreSection
            initialPosts={loadMoreInitial}
            authors={authors}
            categories={categories}
            perClick={perClick}
            totalIds={loadMoreIds}
          />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8 sticky top-20">
          <HomeExploreCategories categories={categories} />

          {/* Popular News Sidebar Widget */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <i className="ri-fire-fill text-amber-500"></i>
              Popular Stories
            </h3>
            <div className="space-y-3">
              {sidebarPopular.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authors={authors}
                  categories={categories}
                  variant="two"
                />
              ))}
            </div>
          </div>

          <HomeSidebarFollow />
        </div>
      </section>

      {/* Bottom Newsletter */}
      <HomeNewsletterBand />
    </div>
  );
}
