import type { Metadata } from "next";
import { HomePageView } from "@/components/home/HomePageView";
import { ThemeLayout } from "@/components/layout/ThemeLayout";
import { resolveHomeSectionIds } from "@/lib/home/sections";
import {
  getAuthors,
  getCategories,
  getFeatured,
  getPosts,
  getSettings,
} from "@/lib/api";
import { loadHomeFile } from "@/lib/data-store";
import { getHomePageAssets } from "@/lib/page-assets";
import { postsByIds } from "@/lib/post-utils";
import { readInlineLegacyScripts } from "@/lib/extracted-content";

const assets = getHomePageAssets();
const homeConfig = loadHomeFile();

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: settings.siteName };
}

export default async function HomePage() {
  const [featured, posts, authors, categories] = await Promise.all([
    getFeatured(),
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const sections = resolveHomeSectionIds(featured);
  const loadMoreIds = homeConfig.loadMore.postIds;
  const loadMoreInitial = postsByIds(posts, loadMoreIds.slice(0, 6));
  const inlineScripts = readInlineLegacyScripts();

  return (
    <ThemeLayout
      bodyClass={assets.bodyClass}
      cssHash={assets.cssHash}
      jsHash={assets.jsHash}
      inlineScripts={inlineScripts}
    >
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-10 xl:px-[40px]">
        <HomePageView
        sections={sections}
        posts={posts}
        authors={authors}
        categories={categories}
        loadMoreIds={loadMoreIds}
        loadMoreInitial={loadMoreInitial}
        perClick={homeConfig.loadMore.perClick}
        />
      </div>
    </ThemeLayout>
  );
}
