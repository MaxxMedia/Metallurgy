import Link from "next/link";
import type { Author, Category, Post } from "@/types/data";
import { HOME_BANNER, HOME_HERO_BANNER, resolveSectionPosts } from "@/lib/post-utils";
import type { HomeSectionIds } from "@/lib/home/sections";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";
import { PostSlider } from "@/components/home/PostSlider";
import { LoadMoreSection } from "@/components/home/LoadMoreSection";
import { HomeExploreCategories } from "@/components/home/HomeExploreCategories";
import { HomeSidebarFollow } from "@/components/home/HomeSidebarFollow";
import { HomeNewsletterBand } from "@/components/home/HomeNewsletterBand";
import { EChild, EInner, EParent, EWidget } from "@/components/home/elementor/ElementorCon";

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
      className="elementor elementor-302 e-lazyloaded"
    >
      {/* Hero + Recent News row */}
      <EParent id="0ae4417" className="e-con-full e-flex" dataSettings={{ background_background: "classic" }}>
        <EChild
          id="c8545b8"
          className="e-flex e-con e-child home-hero-banner"
          dataSettings={{ background_background: "classic" }}
          style={
            {
              "--homeHeroBanner": `url(${HOME_HERO_BANNER})`,
            } as React.CSSProperties
          }
        >
          <EChild id="624f3f5" className="e-con-full e-flex">
            <EWidget id="ded5d98" widgetType="fpg-post-grid">
              <div className="fpg-post-parent">
                <div className="fpg-post-grid">
                  {hero ? (
                    <PostCard
                      post={hero}
                      authors={authors}
                      categories={categories}
                      variant="one"
                      titleTag="h1"
                    />
                  ) : null}
                </div>
              </div>
            </EWidget>
          </EChild>
          <EChild id="11aa2d4" className="e-con-full e-flex">
            <EWidget
              id="5d4aa55"
              widgetType="fpg-post-grid"
              dataSettings={{ thumbnail_type: "play_btn" }}
            >
              <div className="fpg-post-parent">
                <div className="fpg-post-grid">
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
                    />
                  ))}
                </div>
              </div>
            </EWidget>
          </EChild>
        </EChild>

        <EChild id="8e9f4c7" className="e-con-full e-flex e-con e-child">
          <EChild id="70364f7" className="e-con-full e-flex">
            <SectionHeading
              title="Recent News"
              viewAllHref="/category/tech"
              level="h4"
              headingId="67a666a"
              buttonId="239add3"
              showDivider={false}
              viewAllWithIcon
            />
          </EChild>
          <EWidget id="e5338fb" widgetType="fpg-post-group">
            <div
              className="fpg-post-group fpg-post-group-four"
              style={{ "--total-post": recent.length } as React.CSSProperties}
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
            </div>
          </EWidget>
        </EChild>
      </EParent>

      {/* Trending News */}
      <EParent id="4b1b016" className="e-flex e-con-boxed">
        <EInner>
          <EChild id="0287184" className="e-con-full e-flex">
            <EChild id="2c59a48" className="e-con-full e-flex">
              <SectionHeading
                title="Trending News"
                viewAllHref="/category/automation"
                headingId="3c53979"
                dividerId="57f0682"
                buttonId="e9d70e6"
              />
            </EChild>
            <EWidget id="ab24245" widgetType="fpg-post-group">
              <div
                className="fpg-post-group fpg-post-group-four"
                style={{ "--total-post": trending.length } as React.CSSProperties}
              >
                {trending[0] ? (
                  <PostCard
                    post={trending[0]}
                    authors={authors}
                    categories={categories}
                    variant="floating"
                    titleTag="h4"
                    cardLarge
                  />
                ) : null}
                {trending.slice(1).map((post) => (
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
              </div>
            </EWidget>
          </EChild>
        </EInner>
      </EParent>

      {/* Contact banner */}
      <EParent id="1a4b570" className="e-flex e-con-boxed">
        <EInner>
          <EChild id="60d6d46" className="e-con-full e-flex">
            <EWidget id="008612d" widgetType="image">
              <Link href="/contact">
                <img
                  loading="lazy"
                  decoding="async"
                  width={1430}
                  height={236}
                  src={HOME_BANNER}
                  className="attachment-full size-full wp-image-6925"
                  alt="Contact us"
                />
              </Link>
            </EWidget>
          </EChild>
        </EInner>
      </EParent>

      {/* Popular News slider */}
      <EParent id="cdd1781" className="e-con-full e-flex">
        <EChild id="55cc759" className="e-con-full e-flex">
          <EChild id="998359b" className="e-flex e-con-boxed">
            <EInner>
              <SectionHeading
                title="Popular News"
                viewAllHref="/category/automation"
                headingId="3e4bb0b"
                dividerId="67bb218"
                buttonId="2457893"
              />
            </EInner>
          </EChild>
          <PostSlider posts={popular} authors={authors} categories={categories} />
        </EChild>
      </EParent>

      {/* Latest News */}
      <EParent id="e8d8030" className="e-flex e-con-boxed">
        <EInner>
          <EChild id="f1f021c" className="e-con-full e-flex">
            <EChild id="355c61f" className="e-con-full e-flex">
              <SectionHeading
                title="Latest News"
                viewAllHref="/category/automation"
                headingId="3919127"
                dividerId="743bbac"
                buttonId="052b74c"
              />
            </EChild>
            <EWidget id="b21c767" widgetType="fpg-post-group">
              <div
                className="fpg-post-group fpg-post-group-two"
                style={{ "--total-post": latest.length } as React.CSSProperties}
              >
                {latest.slice(0, 2).map((post) => (
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
                {latest.slice(2).map((post) => (
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
              </div>
            </EWidget>
          </EChild>
        </EInner>
      </EParent>

      {/* Mid 3-card row */}
      <EParent id="802a803" className="e-flex e-con-boxed">
        <EInner>
          <EChild id="925f873" className="e-con-full e-flex">
            <EChild id="2eddd47" className="e-con-full e-flex">
              {null}
            </EChild>
            <EWidget id="0255ec1" widgetType="fpg-post-grid">
              <div className="fpg-post-parent">
                <div className="fpg-post-grid">
                  {midGrid.map((post) => (
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
                </div>
              </div>
            </EWidget>
          </EChild>
        </EInner>
      </EParent>

      {/* Top of week + Explore + Sidebar (mirror: all under c03d65c flex row) */}
      <EParent id="eff206a" className="e-flex e-con-boxed">
        <EInner>
          <EChild id="a4cf690" className="e-con-full e-flex">
            <EChild id="c03d65c" className="e-con-full e-flex">
              <EChild id="4849007" className="e-con-full e-flex">
                <EChild id="1e632f9" className="e-con-full e-flex">
                  <SectionHeading
                    title="Top of This Week"
                    headingId="3e4b460"
                    dividerId="426dc0b"
                  />
                </EChild>
                <EWidget
                  id="676dbe6"
                  widgetType="fpg-post-grid"
                  dataSettings={{ thumbnail_type: "image" }}
                >
                  <div className="fpg-post-parent">
                    <div className="fpg-post-grid fpg-ajax">
                      <LoadMoreSection
                        initialPosts={loadMoreInitial}
                        authors={authors}
                        categories={categories}
                        perClick={perClick}
                        totalIds={loadMoreIds}
                      />
                    </div>
                  </div>
                </EWidget>
              </EChild>

              <EChild
                id="ca280db"
                className="e-con-full e-flex"
                dataSettings={{ background_background: "classic" }}
              >
                <HomeExploreCategories categories={categories} />

                <EChild
                  id="08e5b41"
                  className="e-con-full e-flex"
                  dataSettings={{ background_background: "classic" }}
                >
                  <EWidget id="d7cf0ea" widgetType="heading" bareContainer>
                    <h4 className="elementor-heading-title elementor-size-default">
                      Popular News
                    </h4>
                  </EWidget>
                  <EWidget id="c7e4c3e" widgetType="fpg-post-grid">
                    <div className="fpg-post-parent">
                      <div className="fpg-post-grid">
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
                      </div>
                    </div>
                  </EWidget>
                </EChild>
                <HomeSidebarFollow />
              </EChild>
            </EChild>
          </EChild>
        </EInner>
      </EParent>

      <HomeNewsletterBand />
    </div>
  );
}
