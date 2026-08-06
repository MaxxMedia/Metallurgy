import fs from "fs";
import path from "path";
import {
  extractMainHtml,
  extractPageMeta,
  rewriteHtml,
} from "./lib/rewrite-html.mjs";

const MIRROR = path.resolve("../technology-news-dark");
const OUT_DIR = path.resolve("content/authors");
const INDEX_PATH = path.resolve("content/authors-index.json");

const DEFAULTS = {
  title: "Author",
  bodyClass:
    "archive author wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "486a3ec76df3334ac43be3b65d768407",
  jsHash: "e39ec1ccf737cac405f5328cc131aa99",
};

const authorRoot = path.join(MIRROR, "author");
const slugs = fs
  .readdirSync(authorRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((slug) => fs.existsSync(path.join(authorRoot, slug, "index.html")));

const index = [];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const slug of slugs) {
  const filePath = path.join(authorRoot, slug, "index.html");
  const raw = fs.readFileSync(filePath, "utf8");
  const mainInner = extractMainHtml(raw);
  if (!mainInner) {
    console.warn("Skip (no main):", slug);
    continue;
  }

  const meta = extractPageMeta(raw, { ...DEFAULTS, title: slug });

  fs.writeFileSync(
    path.join(OUT_DIR, `${slug}.html`),
    rewriteHtml(mainInner),
    "utf8",
  );

  index.push({ slug, ...meta });
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Indexed ${index.length} authors → ${OUT_DIR}`);
