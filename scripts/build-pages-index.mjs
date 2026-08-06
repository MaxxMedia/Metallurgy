import fs from "fs";
import path from "path";
import {
  extractMainHtml,
  extractPageMeta,
  rewriteHtml,
} from "./lib/rewrite-html.mjs";

const MIRROR = path.resolve("../technology-news-dark");
const OUT_DIR = path.resolve("content/pages");
const INDEX_PATH = path.resolve("content/pages-index.json");

const DEFAULTS = {
  title: "Page",
  bodyClass:
    "page wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "a660e54059afaf59ae3ea81fe5f2b73b",
  jsHash: "f23c4515148fd2c66517c9c3a3b3df22",
};

/** Root-level mirror folders → Next route slug (same name). */
const PAGE_SLUGS = ["blog", "about-us", "contact", "login", "register"];

/** No search HTML in mirror; blog archive is closest layout for form action `/search`. */
const SEARCH_SOURCE = "blog";

const index = [];

fs.mkdirSync(OUT_DIR, { recursive: true });

function indexPage(slug, filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const mainInner = extractMainHtml(raw);
  if (!mainInner) {
    console.warn("Skip (no main):", slug);
    return;
  }

  const meta = extractPageMeta(raw, { ...DEFAULTS, title: slug });

  fs.writeFileSync(
    path.join(OUT_DIR, `${slug}.html`),
    rewriteHtml(mainInner),
    "utf8",
  );

  index.push({ slug, ...meta });
}

for (const slug of PAGE_SLUGS) {
  const filePath = path.join(MIRROR, slug, "index.html");
  if (!fs.existsSync(filePath)) {
    console.warn("Missing:", filePath);
    continue;
  }
  indexPage(slug, filePath);
}

const searchSourcePath = path.join(MIRROR, SEARCH_SOURCE, "index.html");
if (fs.existsSync(searchSourcePath)) {
  indexPage("search", searchSourcePath);
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Indexed ${index.length} pages → ${OUT_DIR}`);
