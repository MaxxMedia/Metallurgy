import fs from "fs";
import path from "path";
import { getCategoryBySlug as getCategoryFromApi } from "@/lib/api";

export type CategoryMeta = {
  slug: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "categories-index.json");
const CATEGORIES_DIR = path.join(process.cwd(), "content", "categories");

let cached: CategoryMeta[] | null = null;

function getLegacyIndex(): CategoryMeta[] {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as CategoryMeta[];
  }
  return cached;
}

export function getAllCategories(): CategoryMeta[] {
  return getLegacyIndex();
}

export function getCategory(slug: string): (CategoryMeta & { mainHtml: string }) | null {
  const meta = getLegacyIndex().find((c) => c.slug === slug);
  if (!meta) return null;

  const htmlPath = path.join(CATEGORIES_DIR, `${slug}.html`);
  if (!fs.existsSync(htmlPath)) return null;

  return {
    ...meta,
    mainHtml: fs.readFileSync(htmlPath, "utf8"),
  };
}

/** Data-layer lookup (JSON). Rendering still uses legacy HTML files. */
export async function getCategoryData(slug: string) {
  return getCategoryFromApi(slug);
}
