import fs from "fs";
import path from "path";

const html = fs.readFileSync("content/extracted/home-main.html", "utf8");
const re = /\/wp-content\/uploads\/[^\s"'>)]+/g;
const urls = [...new Set(html.match(re) ?? [])];
const pub = path.resolve("public");
const missing = urls.filter((u) => !fs.existsSync(path.join(pub, u)));

console.log(`URLs: ${urls.length}, missing on disk: ${missing.length}`);
missing.forEach((u) => console.log(u));
