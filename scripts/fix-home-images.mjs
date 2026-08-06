import fs from "fs";
import path from "path";
import { fixUploadImageUrls } from "./lib/rewrite-html.mjs";

const ROOT = path.resolve(".");
const MIRROR_UPLOADS = path.resolve(
  "../technology-news-dark/wp-content/uploads",
);
const PUBLIC_UPLOADS = path.join(ROOT, "public/wp-content/uploads");

const TARGETS = [
  path.join(ROOT, "content/extracted/header.html"),
  path.join(ROOT, "content/extracted/home-main.html"),
  path.join(ROOT, "content/extracted/footer.html"),
  path.join(ROOT, "content/extracted/body-tail.html"),
];

function patchFile(filePath, uploadsRoot) {
  if (!fs.existsSync(filePath)) return false;
  const raw = fs.readFileSync(filePath, "utf8");
  const next = fixUploadImageUrls(raw, uploadsRoot);
  if (next !== raw) {
    fs.writeFileSync(filePath, next, "utf8");
    console.log("Patched", path.relative(ROOT, filePath));
    return true;
  }
  return false;
}

let patched = false;
for (const file of TARGETS) {
  if (patchFile(file, MIRROR_UPLOADS)) patched = true;
}

if (!patched) {
  console.log("No image URL changes needed in extracted shell.");
}
