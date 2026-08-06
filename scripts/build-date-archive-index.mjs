import fs from "fs";
import path from "path";
import {
  extractMainHtml,
  extractPageMeta,
  rewriteHtml,
} from "./lib/rewrite-html.mjs";

const MIRROR = path.resolve("../technology-news-dark");
const OUT_DIR = path.resolve("content/date-archives");
const INDEX_PATH = path.resolve("content/date-archives-index.json");

const DEFAULTS = {
  title: "Archive",
  bodyClass:
    "archive date wp-theme-nerio scheme-light elementor-default elementor-kit-4659",
  cssHash: "3fd97b5895d425cb30e9cdb60d4e22de",
  jsHash: "835be14e8b2b7249773f157bfb1c02dc",
};

const yearRoot = path.join(MIRROR, "2025");

const archives = [];

function walk(dir, segments) {
  const indexPath = path.join(dir, "index.html");
  if (fs.existsSync(indexPath) && segments.length >= 1 && segments.length <= 3) {
    archives.push({ segments: [...segments], filePath: indexPath });
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!ent.isDirectory() || ent.name === "feed") continue;
    walk(path.join(dir, ent.name), [...segments, ent.name]);
  }
}

walk(yearRoot, ["2025"]);

function fileKey(segments) {
  return segments.join("-");
}

function archiveKind(segments) {
  if (segments.length === 1) return "year";
  if (segments.length === 2) return "month";
  return "day";
}

const index = [];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { segments, filePath } of archives) {
  const raw = fs.readFileSync(filePath, "utf8");
  const mainInner = extractMainHtml(raw);
  if (!mainInner) {
    console.warn("Skip (no main):", segments.join("/"));
    continue;
  }

  const meta = extractPageMeta(raw, {
    ...DEFAULTS,
    title: segments.join("/"),
  });

  const key = fileKey(segments);
  fs.writeFileSync(
    path.join(OUT_DIR, `${key}.html`),
    rewriteHtml(mainInner),
    "utf8",
  );

  const kind = archiveKind(segments);
  index.push({
    key,
    kind,
    year: segments[0],
    month: segments[1] ?? null,
    day: segments[2] ?? null,
    ...meta,
  });
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
console.log(`Indexed ${index.length} date archives → ${OUT_DIR}`);
