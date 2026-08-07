import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fixBrokenAuthorLinks } from "./lib/rewrite-html.mjs";

const shellPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../data/shell.json",
);
const shell = JSON.parse(fs.readFileSync(shellPath, "utf8"));
const keys = ["headerHtml", "footerHtml", "bodyTailHtml", "homeMainHtml"];
let changed = false;
for (const key of keys) {
  if (typeof shell[key] !== "string") continue;
  const next = fixBrokenAuthorLinks(shell[key]);
  if (next !== shell[key]) {
    shell[key] = next;
    changed = true;
  }
}
if (changed) fs.writeFileSync(shellPath, `${JSON.stringify(shell, null, 2)}\n`, "utf8");
