import fs from "fs";
import path from "path";
import { fixUploadImageUrls } from "./lib/rewrite-html.mjs";

const ROOT = path.resolve(".");
const MIRROR_UPLOADS = path.resolve(
  "../technology-news-dark/wp-content/uploads",
);
const PUBLIC_UPLOADS = path.join(ROOT, "public/wp-content/uploads");
const SHELL_PATH = path.join(ROOT, "data/shell.json");

function patchShellJson(uploadsRoot) {
  if (!fs.existsSync(SHELL_PATH)) return false;
  const shell = JSON.parse(fs.readFileSync(SHELL_PATH, "utf8"));
  let changed = false;
  for (const key of [
    "headerHtml",
    "footerHtml",
    "bodyTailHtml",
    "homeMainHtml",
  ]) {
    if (typeof shell[key] !== "string") continue;
    const next = fixUploadImageUrls(shell[key], uploadsRoot);
    if (next !== shell[key]) {
      shell[key] = next;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(SHELL_PATH, JSON.stringify(shell, null, 2), "utf8");
    console.log("Patched data/shell.json");
  }
  return changed;
}

let patched = false;
patched = patchShellJson(MIRROR_UPLOADS) || patched;
patched = patchShellJson(PUBLIC_UPLOADS) || patched;

if (!patched) {
  console.log("No shell image URL changes needed.");
}
