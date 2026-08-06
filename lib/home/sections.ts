import type { FeaturedContent } from "@/types/data";

export type HomeSectionIds = {
  heroId: number;
  heroAsideIds: number[];
  recentNewsIds: number[];
  trendingIds: number[];
  popularSliderIds: number[];
  latestNewsIds: number[];
  midGridIds: number[];
  sidebarPopularIds: number[];
};

/** Slice featured pool to match home layout sections (mirrors index.html ordering). */
export function resolveHomeSectionIds(featured: FeaturedContent): HomeSectionIds {
  const pool = featured.postIds.filter((id) => id !== featured.heroPostId);
  return {
    heroId: featured.heroPostId ?? pool[0]!,
    heroAsideIds: pool.slice(0, 2),
    recentNewsIds: pool.slice(2, 5),
    trendingIds: pool.slice(6, 12),
    popularSliderIds: pool.slice(12, 22),
    latestNewsIds: pool.slice(22, 28),
    midGridIds: pool.slice(0, 3),
    sidebarPopularIds: pool.slice(12, 16),
  };
}
