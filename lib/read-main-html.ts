import fs from "fs";
import { normalizeLegacyHtml } from "@/lib/normalize-legacy-html";

export function readMainHtmlFile(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return normalizeLegacyHtml(fs.readFileSync(filePath, "utf8"));
}
