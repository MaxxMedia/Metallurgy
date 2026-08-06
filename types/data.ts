export interface SiteSettings {
  siteName: string;
  tagline: string;
  locale: string;
  logo: string;
  logoMobile: string;
  favicon: string;
  preloaderImage: string;
  loginUrl: string;
  searchUrl: string;
  weather: {
    location: string;
    temperatureC: number;
  };
  socialLinks: SocialLink[];
  newsletter: {
    title: string;
    description: string;
  };
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  network: string;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface SiteMenus {
  primary: MenuItem[];
  mobile: MenuItem[];
  footerCategories: MenuItem[];
}

export interface Author {
  id: number;
  slug: string;
  name: string;
  url: string;
  avatar?: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  url: string;
  postCount: number;
  image?: string;
  color?: string;
  cssHash?: string;
  jsHash?: string;
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
  url: string;
  cssHash?: string;
  jsHash?: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  year: string;
  month: string;
  day: string;
  dateISO: string;
  authorId: number;
  categoryIds: number[];
  tagIds: number[];
  featuredImage?: string;
  views?: number;
  categoryLabel?: string;
  categorySlug?: string;
  categoryColor?: string;
  cssHash: string;
  jsHash: string;
}

export interface FeaturedContent {
  heroPostId: number | null;
  postIds: number[];
}

export interface TrendingContent {
  label: string;
  postIds: number[];
}

export interface Advertisement {
  id: string;
  placement: string;
  image: string;
  alt: string;
  href?: string;
}

export interface SidebarWidget {
  id: string;
  type: "popular" | "categories" | "social" | "newsletter" | "ad";
  title?: string;
  postIds?: number[];
  categorySlugs?: string[];
}

export interface PostsDataFile {
  posts: Post[];
}

export interface CategoriesDataFile {
  categories: Category[];
}

export interface TagsDataFile {
  tags: Tag[];
}

export interface AuthorsDataFile {
  authors: Author[];
}

export interface FeaturedDataFile extends FeaturedContent {}

export interface TrendingDataFile extends TrendingContent {}

export interface AdvertisementsDataFile {
  advertisements: Advertisement[];
}

export interface MenuDataFile extends SiteMenus {}

export interface SettingsDataFile extends SiteSettings {}

export interface WidgetsDataFile {
  sidebar: SidebarWidget[];
}

export interface HomeLoadMoreConfig {
  perClick: number;
  postIds: number[];
}

export interface HomeDataFile {
  loadMore: HomeLoadMoreConfig;
  sectionPostCounts: {
    hero: number;
    ticker: number;
    homeMain: number;
  };
}
