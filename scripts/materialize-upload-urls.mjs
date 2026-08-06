import fs from "fs";
import path from "path";
import {
  FALLBACK_UPLOAD_IMAGE,
  fixUploadImageUrls,
  resolveUploadUrl,
} from "./lib/rewrite-html.mjs";

const ROOT = path.resolve(".");
const PUBLIC_ROOT = path.join(ROOT, "public");
const MIRROR_UPLOADS = path.resolve(
  "../technology-news-dark/wp-content/uploads",
);
const PUBLIC_UPLOADS = path.join(PUBLIC_ROOT, "wp-content/uploads");

const UPLOAD_RE = /\/wp-content\/uploads\/[^\s"'<>)]+\.(?:jpg|jpeg|png|webp|gif)/gi;

function collectHtmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) collectHtmlFiles(full, out);
    else if (ent.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const htmlFiles = collectHtmlFiles(path.join(ROOT, "content"));

const urlSet = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const fixed = fixUploadImageUrls(html, MIRROR_UPLOADS);
  if (fixed !== html) {
    fs.writeFileSync(file, fixed, "utf8");
    console.log("Rewrote URLs in", path.relative(ROOT, file));
  }
  for (const match of fixed.matchAll(UPLOAD_RE)) {
    urlSet.add(match[0]);
  }
}

function copyToPublic(url) {
  const rel = url.replace(/^\//, "");
  const dest = path.join(PUBLIC_ROOT, rel);
  if (fs.existsSync(dest)) return false;

  const resolved = resolveUploadUrl(url, PUBLIC_UPLOADS);
  const resolvedRel = resolved.replace(/^\//, "");
  let src = path.join(PUBLIC_ROOT, resolvedRel);
  if (!fs.existsSync(src)) {
    src = path.join(PUBLIC_ROOT, FALLBACK_UPLOAD_IMAGE.replace(/^\//, ""));
  }
  if (!fs.existsSync(src)) return false;

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

let created = 0;
for (const url of urlSet) {
  if (copyToPublic(url)) created += 1;
}

console.log(`Materialized ${created} missing upload files (dummy copies).`);
