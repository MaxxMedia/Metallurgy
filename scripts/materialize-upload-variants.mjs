import fs from "fs";
import path from "path";
import {
  FALLBACK_UPLOAD_IMAGE,
  fixUploadImageUrls,
  resolveUploadUrlForPublic,
} from "./lib/rewrite-html.mjs";

const ROOT = path.resolve(".");
const PUBLIC_UPLOADS = path.join(ROOT, "public/wp-content/uploads");
const MIRROR = path.resolve("../technology-news-dark");
const DATA_DIR = path.join(ROOT, "data");
const FALLBACK_REL = FALLBACK_UPLOAD_IMAGE.replace(/^\/wp-content\/uploads\//, "");
const FALLBACK_ABS = path.join(PUBLIC_UPLOADS, FALLBACK_REL);

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

function collectUrlsFromWpJson() {
  const wpRoot = path.join(MIRROR, "wp-json", "wp", "v2");
  const urls = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".json")) {
        const raw = fs.readFileSync(full, "utf8");
        const matches = raw.match(UPLOAD_URL_RE) ?? [];
        urls.push(...matches.map(normalizeUploadUrl));
      }
    }
  }
  walk(wpRoot);
  return urls;
}

function collectDataJsonFiles() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(DATA_DIR, f));
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

for (const url of collectUrlsFromWpJson()) {
  if (seen.has(url)) continue;
  seen.add(url);
  const rel = url.replace(/^\/wp-content\/uploads\//, "");
  const before = fs.existsSync(path.join(PUBLIC_UPLOADS, rel));
  materializeUrl(url);
  const after = fs.existsSync(path.join(PUBLIC_UPLOADS, rel));
  if (!before && after) created += 1;
}

for (const file of collectDataJsonFiles()) {
  let raw = fs.readFileSync(file, "utf8");
  const next = fixUploadImageUrls(raw, PUBLIC_UPLOADS);
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    raw = next;
  }
  const urls = raw.match(UPLOAD_URL_RE) ?? [];
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

console.log(
  `Materialized ${created} missing upload files (dummy copies) under public/wp-content/uploads`,
);
