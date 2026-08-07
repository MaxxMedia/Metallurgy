import fs from "fs";
import path from "path";

const cssPath = path.join(
  "public/wp-content/uploads/sites/32/siteground-optimizer-assets",
  "siteground-optimizer-combined-css-401bcdbaf8365cbf5a3e479a0f993905.css",
);

const from = 'url("../2025/11/nerio_adds-1.jpg")';
const to = 'url("/wp-content/uploads/sites/32/2025/11/nerio_adds-1.jpg")';

const css = fs.readFileSync(cssPath, "utf8");
const count = css.split(from).length - 1;
if (count === 0) {
  console.log("No relative nerio_adds URLs to patch (already fixed?).");
} else {
  fs.writeFileSync(cssPath, css.split(from).join(to), "utf8");
  console.log(`Patched ${count} nerio_adds-1.jpg URL(s) in home CSS bundle.`);
}
