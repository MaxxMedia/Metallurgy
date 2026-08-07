import fs from "fs";
import path from "path";
import { rewriteHtml } from "./lib/rewrite-html.mjs";

const ROOT = path.resolve(".");
const MIRROR = path.resolve("../technology-news-dark");
const WP_JSON = path.join(MIRROR, "wp-json", "wp", "v2");
const DATA_DIR = path.join(ROOT, "data");
const POSTS_HTML_DIR = path.join(ROOT, "content", "posts");
const LEGACY_POSTS_INDEX = path.join(ROOT, "content", "posts-index.json");

const ARCHIVE_DEFAULTS = {
  title: "Archive",
  bodyClass:
    "archive wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "3fd97b5895d425cb30e9cdb60d4e22de",
  jsHash: "835be14e8b2b7249773f157bfb1c02dc",
};

const PAGE_DEFAULTS = {
  title: "Page",
  bodyClass:
    "page wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "a660e54059afaf59ae3ea81fe5f2b73b",
  jsHash: "f23c4515148fd2c66517c9c3a3b3df22",
};

const POST_DEFAULTS = {
  title: "Post",
  bodyClass:
    "wp-singular post-template-default single single-post single-format-standard wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "40a174fc24795e8619e311e6ae556546",
  jsHash: "d0b1d1040c6ad243be3a9cc1670d5450",
};

function decodeHtml(text) {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripSiteSuffix(title) {
  return decodeHtml(title).replace(/\s*[–-]\s*Technology News Dark\s*$/i, "").trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadWpPosts() {
  const dir = path.join(WP_JSON, "posts");
  const map = new Map();
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const post = readJson(path.join(dir, file));
    map.set(post.id, post);
  }
  return map;
}

function wpUploadToLocal(url) {
  if (!url) return undefined;
  const match = url.match(/\/wp-content\/uploads\/(.+)$/);
  return match ? `/wp-content/uploads/${match[1]}` : url;
}

function parsePostId(bodyClass) {
  const m = bodyClass.match(/postid-(\d+)/);
  return m ? Number(m[1]) : null;
}

function extractSlugsFromHtml(html, pattern) {
  const slugs = [];
  const re = pattern;
  let m;
  while ((m = re.exec(html))) {
    const slug = m[1];
    if (!slugs.includes(slug)) slugs.push(slug);
  }
  return slugs;
}

function extractLoadMoreSlugs(homeHtml) {
  const marker = 'fpg-post-grid fpg-ajax';
  const start = homeHtml.indexOf(marker);
  if (start === -1) return [];
  const end = homeHtml.indexOf("fpg-loadmore-wrapper", start);
  const chunk =
    end === -1 ? homeHtml.slice(start) : homeHtml.slice(start, end);
  return extractSlugsFromHtml(
    chunk,
    /fpg-post-title[^>]*>[\s\S]*?href="\/\d{4}\/\d{2}\/\d{2}\/([^"]+)"/g,
  );
}

function parseMenuItems(html, menuId) {
  const chunk = html.includes(`id="${menuId}"`)
    ? html.split(`id="${menuId}"`)[1]?.slice(0, 80_000) ?? html
    : html;
  const items = [];
  const re =
    /<li[^>]*id="menu-item-(\d+)"[^>]*>[\s\S]*?href="([^"]*)"[^>]*>[\s\S]*?menu-item-text">([^<]*)</gi;
  let m;
  while ((m = re.exec(chunk))) {
    items.push({
      id: m[1],
      href: m[2].replace(/\/index\.html$/, "").replace(/^\.\.\//, "/"),
      label: decodeHtml(m[3].trim()),
    });
  }
  return items.map(({ id, label, href }) => ({
    id,
    label,
    href: href.startsWith("http")
      ? href
      : href.startsWith("/")
        ? href
        : `/${href}`,
  }));
}

function slugToPostId(slug, posts) {
  const post = posts.find((p) => p.slug === slug);
  return post?.id ?? null;
}

function readPreviousArray(fileName, key) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) return [];
  const data = readJson(filePath);
  return data[key] ?? data.archives ?? [];
}

function mapBySlug(items) {
  return new Map(items.map((item) => [item.slug, item]));
}

function archiveKey(archive) {
  if (archive.type === "year") return `year:${archive.year}`;
  if (archive.type === "month") return `month:${archive.year}-${archive.month}`;
  return `day:${archive.year}-${archive.month}-${archive.day}`;
}

function loadLegacyPostIndex() {
  if (!fs.existsSync(LEGACY_POSTS_INDEX)) return new Map();
  return mapBySlug(readJson(LEGACY_POSTS_INDEX));
}

function loadPostMainHtml(slug) {
  const filePath = path.join(POSTS_HTML_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) return undefined;
  let html = fs.readFileSync(filePath, "utf8").trim();
  html = html.replace(/<\/main>\s*$/i, "");
  return rewriteHtml(html);
}

function walkWpPosts(prevBySlug) {
  const legacyBySlug = loadLegacyPostIndex();
  const dir = path.join(WP_JSON, "posts");
  if (!fs.existsSync(dir)) return [];
  const rows = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const wp = readJson(path.join(dir, file));
    const [year, month, day] = wp.date.slice(0, 10).split("-");
    const legacy = legacyBySlug.get(wp.slug);
    const prev = prevBySlug.get(wp.slug);
    const meta = legacy ?? prev;
    rows.push({
      slug: wp.slug,
      year,
      month,
      day,
      title: stripSiteSuffix(wp.title.rendered),
      bodyClass:
        meta?.bodyClass ??
        `${POST_DEFAULTS.bodyClass} postid-${wp.id}`,
      cssHash: meta?.cssHash ?? POST_DEFAULTS.cssHash,
      jsHash: meta?.jsHash ?? POST_DEFAULTS.jsHash,
    });
  }
  return rows.sort((a, b) =>
    `${a.year}${a.month}${a.day}${a.slug}`.localeCompare(
      `${b.year}${b.month}${b.day}${b.slug}`,
    ),
  );
}

function walkWpTaxonomy(taxDir, prevBySlug, idPrefix) {
  if (!fs.existsSync(taxDir)) return [];
  return fs
    .readdirSync(taxDir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const wp = readJson(path.join(taxDir, file));
      const prev = prevBySlug.get(wp.slug);
      return {
        slug: wp.slug,
        title: wp.name,
        bodyHtml: prev?.bodyHtml,
        bodyClass:
          prev?.bodyClass ??
          `${ARCHIVE_DEFAULTS.bodyClass} ${idPrefix}-${wp.id}`,
        cssHash: prev?.cssHash ?? ARCHIVE_DEFAULTS.cssHash,
        jsHash: prev?.jsHash ?? ARCHIVE_DEFAULTS.jsHash,
      };
    });
}

const PAGE_SLUGS = ["blog", "about-us", "contact", "login", "register"];

function buildWpPageRows(prevBySlug) {
  const pagesDir = path.join(WP_JSON, "pages");
  const wpPages = [];
  if (fs.existsSync(pagesDir)) {
    for (const file of fs.readdirSync(pagesDir)) {
      if (!file.endsWith(".json")) continue;
      wpPages.push(readJson(path.join(pagesDir, file)));
    }
  }

  const pages = [];
  for (const slug of PAGE_SLUGS) {
    const wp = wpPages.find((p) => p.slug === slug);
    const prev = prevBySlug.get(slug);
    pages.push({
      slug,
      title: wp ? stripSiteSuffix(wp.title.rendered) : slug,
      bodyHtml: prev?.bodyHtml,
      bodyClass: prev?.bodyClass ?? PAGE_DEFAULTS.bodyClass,
      cssHash: prev?.cssHash ?? PAGE_DEFAULTS.cssHash,
      jsHash: prev?.jsHash ?? PAGE_DEFAULTS.jsHash,
    });
  }

  const blog = pages.find((p) => p.slug === "blog");
  const searchPrev = prevBySlug.get("search");
  pages.push({
    slug: "search",
    title: "Search",
    bodyHtml: searchPrev?.bodyHtml,
    bodyClass: searchPrev?.bodyClass ?? blog?.bodyClass ?? PAGE_DEFAULTS.bodyClass,
    cssHash: searchPrev?.cssHash ?? blog?.cssHash ?? PAGE_DEFAULTS.cssHash,
    jsHash: searchPrev?.jsHash ?? blog?.jsHash ?? PAGE_DEFAULTS.jsHash,
  });

  return pages;
}

function buildDateArchivesFromPosts(posts, prevArchives) {
  const prevByKey = new Map(prevArchives.map((a) => [archiveKey(a), a]));
  const archives = [];
  const years = [...new Set(posts.map((p) => p.year))].sort();
  for (const year of years) {
    const prev = prevByKey.get(`year:${year}`);
    archives.push({
      type: "year",
      year,
      title: prev?.title ?? year,
      bodyHtml: prev?.bodyHtml,
      bodyClass: prev?.bodyClass ?? ARCHIVE_DEFAULTS.bodyClass,
      cssHash: prev?.cssHash ?? ARCHIVE_DEFAULTS.cssHash,
      jsHash: prev?.jsHash ?? ARCHIVE_DEFAULTS.jsHash,
    });
  }

  const monthKeys = [
    ...new Set(posts.map((p) => `${p.year}-${p.month}`)),
  ].sort();
  for (const key of monthKeys) {
    const [year, month] = key.split("-");
    const prev = prevByKey.get(`month:${key}`);
    archives.push({
      type: "month",
      year,
      month,
      title: prev?.title ?? `${year}/${month}`,
      bodyHtml: prev?.bodyHtml,
      bodyClass: prev?.bodyClass ?? ARCHIVE_DEFAULTS.bodyClass,
      cssHash: prev?.cssHash ?? ARCHIVE_DEFAULTS.cssHash,
      jsHash: prev?.jsHash ?? ARCHIVE_DEFAULTS.jsHash,
    });
  }

  const dayKeys = [
    ...new Set(posts.map((p) => `${p.year}-${p.month}-${p.day}`)),
  ].sort();
  for (const key of dayKeys) {
    const [year, month, day] = key.split("-");
    const prev = prevByKey.get(`day:${key}`);
    archives.push({
      type: "day",
      year,
      month,
      day,
      title: prev?.title ?? `${year}/${month}/${day}`,
      bodyHtml: prev?.bodyHtml,
      bodyClass: prev?.bodyClass ?? ARCHIVE_DEFAULTS.bodyClass,
      cssHash: prev?.cssHash ?? ARCHIVE_DEFAULTS.cssHash,
      jsHash: prev?.jsHash ?? ARCHIVE_DEFAULTS.jsHash,
    });
  }

  return archives;
}

function loadAuthorFromData(prevAuthors) {
  const prev = prevAuthors.find((a) => a.slug === "istiak");
  if (prev) return prev;
  return {
    id: 2,
    slug: "istiak",
    name: "Matt Rosnor",
    url: "/author/istiak",
  };
}

const prevPosts = mapBySlug(readPreviousArray("posts.json", "posts"));
const prevCategories = mapBySlug(readPreviousArray("categories.json", "categories"));
const prevTags = mapBySlug(readPreviousArray("tags.json", "tags"));
const prevPages = mapBySlug(readPreviousArray("pages.json", "pages"));
const prevArchives = readPreviousArray("date-archives.json", "archives");
const prevAuthors = readPreviousArray("authors.json", "authors");

const postsIndex = walkWpPosts(prevPosts);
const categoriesIndex = walkWpTaxonomy(
  path.join(WP_JSON, "categories"),
  prevCategories,
  "category",
);
const tagsIndex = walkWpTaxonomy(
  path.join(WP_JSON, "tags"),
  prevTags,
  "tag",
);
const mirrorPages = buildWpPageRows(prevPages);
const wpPosts = loadWpPosts();
const dateArchives = buildDateArchivesFromPosts(postsIndex, prevArchives);

const categoryColors = {
  automation: "#00b5ed",
  digital: "#0073ff",
  future: "#54bd05",
  gadget: "#00ad48",
  innovation: "#59a255",
  robotics: "#8e44ad",
  software: "#f27100",
  "tech-2": "#ff5733",
  tech: "#ff5733",
};

const posts = postsIndex.map((row) => {
  const id = parsePostId(row.bodyClass) ?? 0;
  const wp = id ? wpPosts.get(id) : null;
  const title = wp
    ? stripSiteSuffix(wp.title.rendered)
    : stripSiteSuffix(row.title);
  const excerpt = wp
    ? wp.excerpt.rendered.replace(/<[^>]+>/g, "").trim()
    : "";
  const categoryIds = wp?.categories ?? [];
  const tagIds = wp?.tags ?? [];
  const dateISO = wp?.date ?? `${row.year}-${row.month}-${row.day}T00:00:00`;
  const elementorMain = loadPostMainHtml(row.slug);
  const prevBody = prevPosts.get(row.slug)?.bodyHtml;
  const wpBody = wp?.content?.rendered
    ? rewriteHtml(wp.content.rendered)
    : undefined;
  const bodyHtml =
    elementorMain ??
    (prevBody?.includes("data-elementor") ? prevBody : undefined) ??
    wpBody;

  return {
    id,
    slug: row.slug,
    title,
    excerpt: decodeHtml(excerpt),
    url: `/${row.year}/${row.month}/${row.day}/${row.slug}`,
    year: row.year,
    month: row.month,
    day: row.day,
    dateISO,
    authorId: wp?.author ?? 2,
    categoryIds,
    tagIds,
    featuredImage: undefined,
    bodyClass: row.bodyClass,
    cssHash: row.cssHash,
    jsHash: row.jsHash,
    bodyHtml,
  };
});

for (const post of posts) {
  const wp = wpPosts.get(post.id);
  if (!wp) continue;
  const imgMatch = wp.content.rendered.match(
    /src="https:\/\/nerio\.rstheme\.com\/technology-news-dark(\/wp-content\/uploads\/[^"]+)"/,
  );
  if (imgMatch) {
    post.featuredImage = imgMatch[1];
  }
}

const categories = categoriesIndex.map((row) => {
  const idMatch = row.bodyClass.match(/category-(\d+)/);
  const id = idMatch ? Number(idMatch[1]) : 0;
  let wp = null;
  try {
    wp = readJson(path.join(WP_JSON, "categories", `${id}.json`));
  } catch {
    /* mirror category */
  }
  const name = wp
    ? wp.name
    : stripSiteSuffix(row.title).replace(/\s*–.*$/, "");
  return {
    id,
    slug: row.slug,
    name,
    url: `/category/${row.slug}`,
    postCount: wp?.count ?? 0,
    cssHash: row.cssHash,
    jsHash: row.jsHash,
    color: categoryColors[row.slug],
    bodyClass: row.bodyClass,
    bodyHtml: row.bodyHtml,
  };
});

for (const post of posts) {
  const cat = categories.find((c) => c.id === post.categoryIds[0]);
  post.categorySlug = cat?.slug;
  post.categoryLabel = cat?.name;
  post.categoryColor = cat?.color;
  post.views = 20 + (post.id % 76);
  if (!post.featuredImage) {
    const n = String((post.id % 19) + 1).padStart(2, "0");
    post.featuredImage = `/wp-content/uploads/sites/32/2025/10/tech_${n}-min-768x381.jpg`;
  }
}

const tags = tagsIndex.map((row) => {
  const idMatch = row.bodyClass.match(/tag-(\d+)/);
  const id = idMatch ? Number(idMatch[1]) : 0;
  let wp = null;
  try {
    wp = readJson(path.join(WP_JSON, "tags", `${id}.json`));
  } catch {
    /* optional */
  }
  return {
    id,
    slug: row.slug,
    name: wp?.name ?? row.slug,
    url: `/tag/${row.slug}`,
    cssHash: row.cssHash,
    jsHash: row.jsHash,
    bodyClass: row.bodyClass,
    bodyHtml: row.bodyHtml,
  };
});

const authors = [loadAuthorFromData(prevAuthors)];

function readShellForBuild() {
  const shellPath = path.join(DATA_DIR, "shell.json");
  if (!fs.existsSync(shellPath)) {
    console.warn("Missing data/shell.json — run npm run extract once while mirror index exists, or commit shell.json.");
    return { headerHtml: "", footerHtml: "", homeMainHtml: "" };
  }
  return readJson(shellPath);
}

const shell = readShellForBuild();
const headerHtml = shell.headerHtml ?? "";
const homeHtml = shell.homeMainHtml ?? "";
const footerHtml = shell.footerHtml ?? "";

const tickerSlugs = extractSlugsFromHtml(
  headerHtml,
  /fpg-ticker-title[^>]*>[\s\S]*?href="\/\d{4}\/\d{2}\/\d{2}\/([^"]+)"/g,
);

const homePostSlugs = extractSlugsFromHtml(
  homeHtml,
  /fpg-post-title[^>]*>[\s\S]*?href="\/\d{4}\/\d{2}\/\d{2}\/([^"]+)"/g,
);

const trendingPostIds = tickerSlugs
  .map((s) => slugToPostId(s, posts))
  .filter(Boolean);
const featuredPostIds = homePostSlugs
  .map((s) => slugToPostId(s, posts))
  .filter(Boolean);

const heroPostId = featuredPostIds[0] ?? null;

const advertisements = [];
const adImgRe = /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g;
for (const source of [footerHtml, homeHtml]) {
  let m;
  while ((m = adImgRe.exec(source))) {
    const src = m[1].startsWith("/") ? m[1] : m[1].replace(/^wp-content/, "/wp-content");
    if (src.includes("spp_") || src.includes("ad-banner") || src.includes("cta-thumb")) {
      advertisements.push({
        id: `ad-${advertisements.length + 1}`,
        placement: source === footerHtml ? "footer" : "home",
        image: src,
        alt: m[2] || "Advertisement",
      });
    }
  }
}

const settings = {
  siteName: "Technology News Dark",
  tagline: "Technology News Dark",
  locale: "en-US",
  logo: "/wp-content/uploads/sites/32/2025/11/logo.png",
  logoMobile: "/wp-content/uploads/sites/32/2025/11/logo.png",
  favicon: "/wp-content/uploads/sites/32/2025/11/favicon02-150x150.png",
  preloaderImage: "/wp-content/themes/nerio/assets/img/preloader.png",
  loginUrl: "/login",
  searchUrl: "/search",
  weather: { location: "California", temperatureC: 28.3 },
  socialLinks: [
    { id: "facebook", label: "Facebook", href: "#", network: "facebook" },
    { id: "instagram", label: "Instagram", href: "#", network: "instagram" },
    { id: "linkedin", label: "LinkedIn", href: "#", network: "linkedin" },
    { id: "pinterest", label: "Pinterest", href: "#", network: "pinterest" },
  ],
  newsletter: {
    title: "Join Our Reader Community",
    description:
      "Get breaking news, updates, and exclusive stories delivered straight to your inbox.",
  },
};

const menu = {
  primary: parseMenuItems(headerHtml, "menu-main-menu"),
  mobile: parseMenuItems(headerHtml, "menu-mobile-menu"),
  footerCategories: parseMenuItems(footerHtml, "menu-main-menu").slice(0, 8),
};

const widgets = {
  sidebar: [
    {
      id: "popular-news",
      type: "popular",
      title: "Popular News",
      postIds: featuredPostIds.slice(0, 5),
    },
    {
      id: "top-categories",
      type: "categories",
      title: "Top Categories",
      categorySlugs: categories
        .filter((c) => c.slug !== "tech")
        .slice(0, 6)
        .map((c) => c.slug),
    },
    {
      id: "follow-us",
      type: "social",
      title: "Follow Us",
    },
  ],
};

fs.mkdirSync(DATA_DIR, { recursive: true });

fs.writeFileSync(
  path.join(DATA_DIR, "posts.json"),
  JSON.stringify({ posts }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "categories.json"),
  JSON.stringify({ categories }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "tags.json"),
  JSON.stringify({ tags }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "authors.json"),
  JSON.stringify({ authors }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "featured.json"),
  JSON.stringify({ heroPostId, postIds: featuredPostIds }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "trending.json"),
  JSON.stringify({ label: "Live News", postIds: trendingPostIds }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "advertisements.json"),
  JSON.stringify({ advertisements }, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "menu.json"),
  JSON.stringify(menu, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "settings.json"),
  JSON.stringify(settings, null, 2),
);
const loadMoreSlugs = extractLoadMoreSlugs(homeHtml);
const loadMoreShownIds = new Set(
  loadMoreSlugs.map((s) => slugToPostId(s, posts)).filter(Boolean),
);
const postsByDateAsc = [...posts].sort((a, b) =>
  a.dateISO.localeCompare(b.dateISO),
);
const loadMorePostIds = postsByDateAsc
  .filter((p) => !loadMoreShownIds.has(p.id))
  .map((p) => p.id);

const home = {
  loadMore: {
    perClick: 3,
    postIds: loadMorePostIds,
  },
  sectionPostCounts: {
    hero: 1,
    ticker: trendingPostIds.length,
    homeMain: homePostSlugs.length,
  },
};

fs.writeFileSync(
  path.join(DATA_DIR, "widgets.json"),
  JSON.stringify(widgets, null, 2),
);
fs.writeFileSync(
  path.join(DATA_DIR, "home.json"),
  JSON.stringify(home, null, 2),
);

const pages = mirrorPages.map((row) => {
  let wp = null;
  try {
    const pageFiles = fs.readdirSync(path.join(WP_JSON, "pages"));
    for (const file of pageFiles) {
      if (!file.endsWith(".json")) continue;
      const candidate = readJson(path.join(WP_JSON, "pages", file));
      if (candidate.slug === row.slug) {
        wp = candidate;
        break;
      }
    }
  } catch {
    /* optional */
  }
  const title = wp
    ? stripSiteSuffix(wp.title.rendered)
    : stripSiteSuffix(row.title);
  const description = wp
    ? wp.excerpt.rendered.replace(/<[^>]+>/g, "").trim()
    : undefined;
  const bodyHtml = wp?.content?.rendered
    ? rewriteHtml(wp.content.rendered)
    : undefined;

  return {
    slug: row.slug,
    title,
    description: description ? decodeHtml(description) : undefined,
    bodyHtml: row.bodyHtml ?? bodyHtml,
    bodyClass: row.bodyClass,
    cssHash: row.cssHash,
    jsHash: row.jsHash,
  };
});

fs.writeFileSync(
  path.join(DATA_DIR, "date-archives.json"),
  JSON.stringify({ archives: dateArchives }, null, 2),
);

fs.writeFileSync(
  path.join(DATA_DIR, "pages.json"),
  JSON.stringify({ pages }, null, 2),
);

console.log(`Wrote data layer → ${DATA_DIR}`);
console.log(
  `  posts: ${posts.length}, categories: ${categories.length}, tags: ${tags.length}, pages: ${pages.length}`,
);
