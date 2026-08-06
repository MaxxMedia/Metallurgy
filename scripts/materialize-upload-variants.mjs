import fs from "fs";
import path from "path";
import {
  FALLBACK_UPLOAD_IMAGE,
  fixUploadImageUrls,
  resolveUploadUrlForPublic,
} from "./lib/rewrite-html.mjs";

const ROOT = path.resolve(".");
const PUBLIC_UPLOADS = path.join(ROOT, "public/wp-content/uploads");
const MIRROR_INDEX = path.resolve("../technology-news-dark/index.html");
const FALLBACK_REL = FALLBACK_UPLOAD_IMAGE.replace(/^\/wp-content\/uploads\//, "");
const FALLBACK_ABS = path.join(PUBLIC_UPLOADS, FALLBACK_REL);

const HTML_DIRS = [
  path.join(ROOT, "content/extracted"),
  path.join(ROOT, "content/posts"),
  path.join(ROOT, "content/categories"),
  path.join(ROOT, "content/tags"),
  path.join(ROOT, "content/pages"),
  path.join(ROOT, "content/authors"),
  path.join(ROOT, "content/date-archives"),
];

const UPLOAD_URL_RE =
  /(?:\/wp-content\/uploads\/|wp-content\/uploads\/)[^\s"'<>)]+\.(?:jpg|jpeg|png|webp|gif)/gi;

function normalizeUploadUrl(raw) {
  let url = raw.startsWith("/") ? raw : `/${raw.replace(/^wp-content/, "/wp-content")}`;
  url = url.replace(
    /https:\/\/nerio\.rstheme\.com\/technology-news-dark/g,
    "",
  );
  return url;
}

function collectUrlsFromMirrorIndex() {
  if (!fs.existsSync(MIRROR_INDEX)) return [];
  const raw = fs.readFileSync(MIRROR_INDEX, "utf8");
  const matches = raw.match(UPLOAD_URL_RE) ?? [];
  return matches.map(normalizeUploadUrl);
}

function collectHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(dir, f));
}

function copyFileEnsured(fromAbs, toAbs) {
  fs.mkdirSync(path.dirname(toAbs), { recursive: true });
  fs.copyFileSync(fromAbs, toAbs);
}

function materializeUrl(urlPath) {
  const rel = urlPath.replace(/^\/wp-content\/uploads\//, "");
  const destAbs = path.join(PUBLIC_UPLOADS, rel);
  if (fs.existsSync(destAbs)) return;

  const resolved = resolveUploadUrlForPublic(urlPath);
  const resolvedRel = resolved.replace(/^\/wp-content\/uploads\//, "");
  const sourceAbs = path.join(PUBLIC_UPLOADS, resolvedRel);

  if (fs.existsSync(sourceAbs)) {
    copyFileEnsured(sourceAbs, destAbs);
    return;
  }
  if (fs.existsSync(FALLBACK_ABS)) {
    copyFileEnsured(FALLBACK_ABS, destAbs);
  }
}

let created = 0;
const seen = new Set();

for (const url of collectUrlsFromMirrorIndex()) {
  if (seen.has(url)) continue;
  seen.add(url);
  const rel = url.replace(/^\/wp-content\/uploads\//, "");
  const before = fs.existsSync(path.join(PUBLIC_UPLOADS, rel));
  materializeUrl(url);
  const after = fs.existsSync(path.join(PUBLIC_UPLOADS, rel));
  if (!before && after) created += 1;
}

for (const dir of HTML_DIRS) {
  for (const file of collectHtmlFiles(dir)) {
    let html = fs.readFileSync(file, "utf8");
    const next = fixUploadImageUrls(html, PUBLIC_UPLOADS);
    if (next !== html) {
      fs.writeFileSync(file, next, "utf8");
    }
    const urls = next.match(UPLOAD_URL_RE) ?? [];
    for (const url of urls) {
      if (seen.has(url)) continue;
      seen.add(url);
      const before = fs.existsSync(
        path.join(PUBLIC_UPLOADS, url.replace(/^\/wp-content\/uploads\//, "")),
      );
      materializeUrl(url);
      const after = fs.existsSync(
        path.join(PUBLIC_UPLOADS, url.replace(/^\/wp-content\/uploads\//, "")),
      );
      if (!before && after) created += 1;
    }
  }
}

console.log(
  `Materialized ${created} missing upload files (dummy copies) under public/wp-content/uploads`,
);
