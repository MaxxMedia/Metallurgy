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

let cached: CategoryMeta[] | null = null;

function getLegacyIndex(): CategoryMeta[] {
  if (!cached) {
    if (fs.existsSync(INDEX_PATH)) {
      cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as CategoryMeta[];
    } else {
      cached = [];
    }
  }
  return cached;
}

export function getAllCategories(): CategoryMeta[] {
  return getLegacyIndex();
}

export function getCategory(slug: string): CategoryMeta | null {
  const meta = getLegacyIndex().find((c) => c.slug === slug);
  if (!meta) return null;
  return meta;
}

export async function getCategoryData(slug: string) {
  return getCategoryFromApi(slug);
}
