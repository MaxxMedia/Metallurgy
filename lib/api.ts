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
import { STOCK_MEDIUM } from "@/lib/home-stock-images";

const getBackendBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Interface for backend API post responses
interface BackendPostResponse {
  id: number;
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string;
  contentBlocks?: any;
  imageUrl?: string;
  authorId?: number | string;
  categoryId?: number | string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  email?: string;
  whatsappNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: number; name: string; slug?: string; bio?: string; avatarUrl?: string; role?: string };
  category?: { id: number; name: string; slug?: string };
}

function mapBackendPostToPost(bp: BackendPostResponse): Post {
  const dateObj = bp.createdAt ? new Date(bp.createdAt) : new Date();
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const slug = bp.slug || `post-${bp.id}`;
  const backendBase = getBackendBaseUrl();

  let img = bp.imageUrl || undefined;
  if (img && img.startsWith("/uploads/")) {
    img = `${backendBase}${img}`;
  }

  let parsedBlocks = undefined;
  if (bp.contentBlocks) {
    if (typeof bp.contentBlocks === "string") {
      try {
        parsedBlocks = JSON.parse(bp.contentBlocks);
      } catch {}
    } else if (Array.isArray(bp.contentBlocks)) {
      parsedBlocks = bp.contentBlocks;
    }
  }

  return {
    id: bp.id,
    slug: slug,
    title: bp.title,
    excerpt: bp.excerpt || (bp.content ? bp.content.replace(/<[^>]+>/g, "").substring(0, 150) + "..." : ""),
    url: `/posts/${slug}`,
    year,
    month,
    day,
    dateISO: dateObj.toISOString(),
    authorId: Number(bp.authorId) || 1,
    categoryIds: bp.categoryId ? [Number(bp.categoryId)] : [1],
    tagIds: [],
    featuredImage: img || STOCK_MEDIUM[bp.id % STOCK_MEDIUM.length],
    categoryLabel: bp.category?.name || undefined,
    categorySlug: bp.category?.slug || undefined,
    cssHash: "siteground-optimizer-combined-css-ed664c8b1fbc253c24424f6231bf450e",
    jsHash: "siteground-optimizer-combined-js-123456",
    bodyHtml: bp.content || undefined,
    contentBlocks: parsedBlocks,
    facebookUrl: bp.facebookUrl,
    linkedinUrl: bp.linkedinUrl,
    twitterUrl: bp.twitterUrl,
    youtubeUrl: bp.youtubeUrl,
    email: bp.email,
    whatsappNumber: bp.whatsappNumber,
  };
}

export async function getPosts(): Promise<Post[]> {
  const localPosts = loadPostsFile().posts;
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/posts?limit=50`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const backendItems: BackendPostResponse[] = json?.data || (Array.isArray(json) ? json : []);
      if (Array.isArray(backendItems) && backendItems.length > 0) {
        const mappedBackendPosts = backendItems.map(mapBackendPostToPost);
        const backendIds = new Set(mappedBackendPosts.map((p) => p.id));
        const filteredLocal = localPosts.filter((p) => !backendIds.has(p.id));
        return [...mappedBackendPosts, ...filteredLocal];
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend posts, using local data fallback:", err);
  }
  return localPosts;
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
  const localCategories = loadCategoriesFile().categories;
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/categories`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const items = json?.data || (Array.isArray(json) ? json : []);
      if (Array.isArray(items) && items.length > 0) {
        const mapped: Category[] = items.map((c: { id: number; name: string; slug?: string; postCount?: number }) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
          url: `/category/${c.slug || c.name.toLowerCase().replace(/\s+/g, "-")}`,
          postCount: c.postCount || 0,
        }));
        const backendIds = new Set(mapped.map((c) => c.id));
        const filteredLocal = localCategories.filter((c) => !backendIds.has(c.id));
        return [...mapped, ...filteredLocal];
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend categories, using local data fallback:", err);
  }
  return localCategories;
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
  const localAuthors = loadAuthorsFile().authors;
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/authors`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const items = json?.data || (Array.isArray(json) ? json : []);
      if (Array.isArray(items) && items.length > 0) {
        const mapped: Author[] = items.map((a: { id: number; name: string; slug?: string; avatarUrl?: string; role?: string; bio?: string }) => ({
          id: a.id,
          name: a.name,
          slug: a.slug || a.name.toLowerCase().replace(/\s+/g, "-"),
          avatarUrl: a.avatarUrl || "/images/avatar.jpg",
          role: a.role || "Author",
          bio: a.bio || "",
          url: `/author/${a.slug || a.name.toLowerCase().replace(/\s+/g, "-")}`,
        }));
        const backendIds = new Set(mapped.map((a) => a.id));
        const filteredLocal = localAuthors.filter((a) => !backendIds.has(a.id));
        return [...mapped, ...filteredLocal];
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend authors, using local data fallback:", err);
  }
  return localAuthors;
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
