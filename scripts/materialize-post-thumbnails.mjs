import fs from "fs";
import path from "path";

const STOCK_MEDIUM = [
  "/wp-content/uploads/sites/32/2025/11/tech_01-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_02-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_03-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_04-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_09-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_13-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_15-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_17-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_18-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/post_54-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/post_57-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/post_13-min-768x381.jpg",
];

const ROOT = path.resolve(".");
const PUBLIC_UPLOADS = path.join(ROOT, "public/wp-content/uploads");
const POSTS_FILE = path.join(ROOT, "data/posts.json");

function copyEnsured(fromAbs, toAbs) {
  if (fs.existsSync(toAbs)) return false;
  if (!fs.existsSync(fromAbs)) return false;
  fs.mkdirSync(path.dirname(toAbs), { recursive: true });
  fs.copyFileSync(fromAbs, toAbs);
  return true;
}

function absFromUrl(url) {
  return path.join(PUBLIC_UPLOADS, url.replace(/^\/wp-content\/uploads\//, ""));
}

function thumbFromMedium(mediumUrl) {
  const ext = mediumUrl.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] ?? ".jpg";
  const stem = mediumUrl.replace(ext, "").replace(/-\d+x\d+$/i, "");
  return `${stem}-150x150${ext}`;
}

const source = STOCK_MEDIUM.map(absFromUrl).find((p) => fs.existsSync(p));
if (!source) {
  console.warn("No stock source image found under public/wp-content/uploads");
  process.exit(0);
}

let created = 0;
const urls = new Set(STOCK_MEDIUM);

for (const url of STOCK_MEDIUM) {
  urls.add(thumbFromMedium(url));
}

const posts = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8")).posts;
for (const post of posts) {
  if (post.featuredImage) urls.add(post.featuredImage);
  const rel = (post.featuredImage ?? "").replace(/^\/wp-content\/uploads\//, "");
  if (rel) {
    urls.add(`/wp-content/uploads/${rel.replace(/(\.[a-z]+)$/i, "-150x150$1")}`);
    urls.add(`/wp-content/uploads/${rel.replace(/(\.[a-z]+)$/i, "-768x381$1")}`);
  }
}

for (const url of urls) {
  if (copyEnsured(source, absFromUrl(url))) created += 1;
}

console.log(`Materialized ${created} post/thumbnail upload files from stock sources.`);
