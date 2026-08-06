import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const MIRROR = path.resolve("../technology-news-dark");
const WP_JSON = path.join(MIRROR, "wp-json", "wp", "v2");
const DATA_DIR = path.join(ROOT, "data");

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

const postsIndex = readJson(path.join(ROOT, "content", "posts-index.json"));
const categoriesIndex = readJson(
  path.join(ROOT, "content", "categories-index.json"),
);
const tagsIndex = readJson(path.join(ROOT, "content", "tags-index.json"));
const wpPosts = loadWpPosts();

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
    cssHash: row.cssHash,
    jsHash: row.jsHash,
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
  };
});

const authors = [
  {
    id: 2,
    slug: "istiak",
    name: "Matt Rosnor",
    url: "/author/istiak",
  },
];

const headerHtml = fs.readFileSync(
  path.join(ROOT, "content", "extracted", "header.html"),
  "utf8",
);
const homeHtml = fs.readFileSync(
  path.join(ROOT, "content", "extracted", "home-main.html"),
  "utf8",
);
const footerHtml = fs.readFileSync(
  path.join(ROOT, "content", "extracted", "footer.html"),
  "utf8",
);

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

console.log(`Wrote data layer → ${DATA_DIR}`);
console.log(`  posts: ${posts.length}, categories: ${categories.length}, tags: ${tags.length}`);
