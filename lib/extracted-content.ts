import fs from "fs";
import path from "path";
import { normalizeLegacyHtml } from "@/lib/normalize-legacy-html";
import type { HeadStylesConfig, InlineLegacyScript } from "@/types/site";

const EXTRACTED_DIR = path.join(process.cwd(), "content", "extracted");

export function readExtractedHtml(
  name: "header" | "footer" | "home-main" | "body-tail",
): string {
  const filePath = path.join(EXTRACTED_DIR, `${name}.html`);
  if (!fs.existsSync(filePath)) return "";
  return normalizeLegacyHtml(fs.readFileSync(filePath, "utf8"));
}

export function readInlineLegacyScripts(): InlineLegacyScript[] {
  const filePath = path.join(EXTRACTED_DIR, "inline-scripts.json");
  if (!fs.existsSync(filePath)) return [];
  const all = JSON.parse(fs.readFileSync(filePath, "utf8")) as InlineLegacyScript[];
  return all.filter(
    (s) =>
      s.content.trim().startsWith("var ") ||
      s.content.trim().startsWith("window.") ||
      s.content.trim().startsWith("("),
  );
}

export function readHeadStylesConfig(): HeadStylesConfig {
  const raw = fs.readFileSync(
    path.join(EXTRACTED_DIR, "head-styles.json"),
    "utf8",
  );
  return JSON.parse(raw) as HeadStylesConfig;
}
