import type {
  Advertisement,
  Author,
  Category,
  FeaturedContent,
  MenuDataFile,
  Post,
  SiteSettings,
  Tag,
  TrendingContent,
  SidebarWidget,
  StaticPage,
} from "@/types/data";
import {
  loadAdvertisementsFile,
  loadAuthorsFile,
  loadCategoriesFile,
  loadFeaturedFile,
  loadMenuFile,
  loadPostsFile,
  loadSettingsFile,
  loadTagsFile,
  loadTrendingFile,
  loadWidgetsFile,
} from "@/lib/data-store";

/** Temporary JSON-backed API — swap implementations here for a real backend later. */

export async function getPosts(): Promise<Post[]> {
  return loadPostsFile().posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export async function getPostByPath(
  month: string,
  day: string,
  slug: string,
): Promise<Post | undefined> {
  return (await getPosts()).find(
    (p) => p.month === month && p.day === day && p.slug === slug,
  );
}

export async function getCategories(): Promise<Category[]> {
  return loadCategoriesFile().categories;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getTags(): Promise<Tag[]> {
  return loadTagsFile().tags;
}

export async function getTagBySlug(slug: string): Promise<Tag | undefined> {
  return (await getTags()).find((t) => t.slug === slug);
}

export async function getAuthors(): Promise<Author[]> {
  return loadAuthorsFile().authors;
}

export async function getAuthorBySlug(
  slug: string,
): Promise<Author | undefined> {
  return (await getAuthors()).find((a) => a.slug === slug);
}

export async function getFeatured(): Promise<FeaturedContent> {
  return loadFeaturedFile();
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const { postIds } = await getFeatured();
  const posts = await getPosts();
  return postIds
    .map((id) => posts.find((p) => p.id === id))
    .filter((p): p is Post => Boolean(p));
}

export async function getTrending(): Promise<TrendingContent> {
  return loadTrendingFile();
}

export async function getTrendingPosts(): Promise<Post[]> {
  const { postIds } = await getTrending();
  const posts = await getPosts();
  return postIds
    .map((id) => posts.find((p) => p.id === id))
    .filter((p): p is Post => Boolean(p));
}

export async function getAdvertisements(): Promise<Advertisement[]> {
  return loadAdvertisementsFile().advertisements;
}

export async function getMenu(): Promise<MenuDataFile> {
  return loadMenuFile();
}

export async function getSettings(): Promise<SiteSettings> {
  return loadSettingsFile();
}

export async function getSidebarWidgets(): Promise<SidebarWidget[]> {
  return loadWidgetsFile().sidebar;
}

export async function getStaticPage(
  slug: StaticPage["slug"],
): Promise<StaticPage | undefined> {
  const { loadPagesFile } = await import("@/lib/data-store");
  return loadPagesFile().pages.find((p) => p.slug === slug);
}
