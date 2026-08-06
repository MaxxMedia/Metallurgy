import fs from "fs";
import path from "path";
import { readMainHtmlFile } from "@/lib/read-main-html";

export type PageMeta = {
  slug: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "pages-index.json");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");

let cached: PageMeta[] | null = null;

function getIndex(): PageMeta[] {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as PageMeta[];
  }
  return cached;
}

export function getAllPages(): PageMeta[] {
  return getIndex();
}

export function getPage(slug: string): (PageMeta & { mainHtml: string }) | null {
  const meta = getIndex().find((p) => p.slug === slug);
  if (!meta) return null;

  const htmlPath = path.join(PAGES_DIR, `${slug}.html`);
  const mainHtml = readMainHtmlFile(htmlPath);
  if (!mainHtml) return null;

  return {
    ...meta,
    mainHtml,
  };
}
