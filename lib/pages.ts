import fs from "fs";
import path from "path";

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
  if (!fs.existsSync(htmlPath)) return null;

  return {
    ...meta,
    mainHtml: fs.readFileSync(htmlPath, "utf8"),
  };
}
