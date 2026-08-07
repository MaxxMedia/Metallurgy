import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = path.resolve(".");
const PUBLIC_UPLOADS = path.join(ROOT, "public/wp-content/uploads");
const REFERER = "https://nerio.rstheme.com/technology-news-dark/";

const ASSETS = [
  {
    url: "https://nerio.rstheme.com/wp-content/uploads/sites/32/2025/11/nerio_adds-1.jpg",
    dest: path.join(PUBLIC_UPLOADS, "sites/32/2025/11/nerio_adds-1.jpg"),
  },
  ...["cta-thumb-01.png", "cta-thumb-02.png", "cta-thumb-03.png", "cta-thumb-04.png", "newsletter-dot.png"].map(
    (name) => ({
      url: `https://nerio.rstheme.com/wp-content/uploads/sites/5/2026/02/${name}`,
      dest: path.join(PUBLIC_UPLOADS, "sites/5/2026/02", name),
    }),
  ),
];

function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 200) {
    return "skip";
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const result = spawnSync(
    "curl",
    ["-sL", "-o", dest, "-H", `Referer: ${REFERER}`, "-H", "User-Agent: Mozilla/5.0", url],
    { stdio: "inherit" },
  );
  if (result.status !== 0 || !fs.existsSync(dest) || fs.statSync(dest).size < 200) {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    return "fail";
  }
  return "ok";
}

let ok = 0;
let fail = 0;
for (const { url, dest } of ASSETS) {
  const status = download(url, dest);
  if (status === "ok") ok += 1;
  else if (status === "fail") fail += 1;
  console.log(path.relative(PUBLIC_UPLOADS, dest), status);
}

if (fail) process.exitCode = 1;
else console.log(`Newsletter assets ready (${ok} downloaded).`);
