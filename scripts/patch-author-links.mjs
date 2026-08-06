import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fixBrokenAuthorLinks } from "./lib/rewrite-html.mjs";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../content/extracted");
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith(".html")) continue;
  const filePath = path.join(dir, name);
  const raw = fs.readFileSync(filePath, "utf8");
  const next = fixBrokenAuthorLinks(raw);
  if (next !== raw) fs.writeFileSync(filePath, next);
}
