import fs from "fs";
import path from "path";

const MIRROR_ROOT = path.resolve("../technology-news-dark");
const MIRROR = path.join(MIRROR_ROOT, "wp-content");
const PUBLIC_WP = path.resolve("public/wp-content");
const PUBLIC_INCLUDES = path.resolve("public/wp-includes");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn("Skip missing:", src);
    return 0;
  }
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      count += copyDir(from, to);
    } else if (ent.isFile()) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      if (!fs.existsSync(to)) {
        fs.copyFileSync(from, to);
        count += 1;
      } else {
        const srcStat = fs.statSync(from);
        const destStat = fs.statSync(to);
        if (srcStat.size !== destStat.size) {
          fs.copyFileSync(from, to);
          count += 1;
        }
      }
    }
  }
  return count;
}

const uploadsSrc = path.join(MIRROR, "uploads", "sites", "32");
const uploadsDest = path.join(PUBLIC_WP, "uploads", "sites", "32");
const themeSrc = path.join(MIRROR, "themes", "nerio");
const themeDest = path.join(PUBLIC_WP, "themes", "nerio");

const copiedUploads = copyDir(uploadsSrc, uploadsDest);
const copiedTheme = copyDir(themeSrc, themeDest);
const copiedIncludes = copyDir(
  path.join(MIRROR_ROOT, "wp-includes", "js"),
  path.join(PUBLIC_INCLUDES, "js"),
);

console.log(
  `Synced mirror assets → public/ (${copiedUploads} uploads, ${copiedTheme} theme, ${copiedIncludes} wp-includes/js files)`,
);
