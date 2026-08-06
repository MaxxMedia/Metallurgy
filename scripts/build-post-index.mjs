import fs from "fs";
import path from "path";

const MIRROR = path.resolve("../technology-news-dark");
const OUT_DIR = path.resolve("content/posts");
const INDEX_PATH = path.resolve("content/posts-index.json");

function rewriteHtml(html) {
  return html
    .replace(/\b(src|href)="wp-content\//g, '$1="/wp-content/')
    .replace(/\b(src|href)="\.\.\/wp-content\//g, '$1="/wp-content/')
    .replace(/\b(src|href)="\.\.\/\.\.\/wp-content\//g, '$1="/wp-content/')
    .replace(/\b(src|href)="\.\.\/\.\.\/\.\.\/wp-content\//g, '$1="/wp-content/')
    .replace(/\b(src|href)="\.\.\/\.\.\/\.\.\/\.\.\/wp-content\//g, '$1="/wp-content/')
    .replace(/url\(wp-content\//g, "url(/wp-content/")
    .replace(/url\(\.\.\/wp-content\//g, "url(/wp-content/")
    .replace(/url\(\.\.\/\.\.\/wp-content\//g, "url(/wp-content/")
    .replace(/url\(\.\.\/\.\.\/\.\.\/wp-content\//g, "url(/wp-content/")
    .replace(/url\(\.\.\/\.\.\/\.\.\/\.\.\/wp-content\//g, "url(/wp-content/")
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="([^"]+)\/index\.html"/g, (_, p) => {
      if (p.startsWith("http") || p.startsWith("/") || p.startsWith("#")) {
        return `href="${p}"`;
      }
      const cleaned = p.replace(/^(\.\.\/)+/, "");
      return `href="/${cleaned}"`;
    })
    .replace(/href="https:\/\/nerio\.rstheme\.com\/technology-news-dark\/?"/g, 'href="/"')
    .replace(/action="https:\/\/nerio\.rstheme\.com\/technology-news-dark\/"/g, 'action="/search"');
}

function extractPost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const rel = path.relative(MIRROR, filePath).replace(/\\/g, "/");
  const parts = rel.split("/");
  if (parts.length !== 5 || parts[4] !== "index.html") return null;

  const [year, month, day, slug, fileName] = parts;
  if (fileName !== "index.html" || !year || !month || !day || !slug) return null;

  const mainStart = raw.indexOf("<main");
  const footerStart = raw.indexOf('<footer class="rstb-footer">');
  if (mainStart === -1 || footerStart === -1) return null;

  const mainOpenEnd = raw.indexOf(">", mainStart) + 1;
  const mainInner = raw.slice(mainOpenEnd, footerStart);

  const titleMatch = raw.match(/<title>([^<]*)<\/title>/i);
  const bodyMatch = raw.match(/<body class="([^"]*)"/);
  const cssMatch = raw.match(/siteground-optimizer-combined-css-([a-f0-9]+)/);
  const jsMatch = raw.match(/siteground-optimizer-combined-js-([a-f0-9]+)/);

  return {
    slug,
    year,
    month,
    day,
    title: titleMatch ? titleMatch[1].trim() : slug,
    bodyClass: bodyMatch ? bodyMatch[1] : "",
    cssHash: cssMatch ? cssMatch[1] : "40a174fc24795e8619e311e6ae556546",
    jsHash: jsMatch ? jsMatch[1] : "d0b1d1040c6ad243be3a9cc1670d5450",
    mainHtml: rewriteHtml(mainInner),
  };
}

function walkPosts(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPosts(full, acc);
    } else if (entry.name === "index.html") {
      const rel = path.relative(MIRROR, full).replace(/\\/g, "/");
      if (/^2025\/\d{2}\/\d{2}\/[^/]+\/index\.html$/.test(rel)) {
        acc.push(full);
      }
    }
  }
  return acc;
}

const files = walkPosts(path.join(MIRROR, "2025"));
const posts = files.map(extractPost).filter(Boolean);

fs.mkdirSync(OUT_DIR, { recursive: true });

const index = posts.map(
  ({ slug, year, month, day, title, bodyClass, cssHash, jsHash }) => ({
    slug,
    year,
    month,
    day,
    title,
    bodyClass,
    cssHash,
    jsHash,
  }),
);

for (const post of posts) {
  fs.writeFileSync(
    path.join(OUT_DIR, `${post.slug}.html`),
    post.mainHtml,
    "utf8",
  );
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Indexed ${posts.length} posts → ${OUT_DIR}`);
