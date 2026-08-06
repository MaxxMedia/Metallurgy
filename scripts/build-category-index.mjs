import fs from "fs";
import path from "path";
import {
  extractMainHtml,
  extractPageMeta,
  rewriteHtml,
} from "./lib/rewrite-html.mjs";

const MIRROR = path.resolve("../technology-news-dark");
const OUT_DIR = path.resolve("content/categories");
const INDEX_PATH = path.resolve("content/categories-index.json");

const DEFAULTS = {
  title: "Category",
  bodyClass:
    "archive category wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "3fd97b5895d425cb30e9cdb60d4e22de",
  jsHash: "835be14e8b2b7249773f157bfb1c02dc",
};

const categoryRoot = path.join(MIRROR, "category");
const slugs = fs
  .readdirSync(categoryRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((slug) => fs.existsSync(path.join(categoryRoot, slug, "index.html")));

const index = [];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const slug of slugs) {
  const filePath = path.join(categoryRoot, slug, "index.html");
  const raw = fs.readFileSync(filePath, "utf8");
  const mainInner = extractMainHtml(raw);
  if (!mainInner) {
    console.warn("Skip (no main):", slug);
    continue;
  }

  const meta = extractPageMeta(raw, {
    ...DEFAULTS,
    title: slug,
  });

  fs.writeFileSync(
    path.join(OUT_DIR, `${slug}.html`),
    rewriteHtml(mainInner),
    "utf8",
  );

  index.push({ slug, ...meta });
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Indexed ${index.length} categories → ${OUT_DIR}`);
