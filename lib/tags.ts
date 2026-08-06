import fs from "fs";
import path from "path";
import { getTagBySlug as getTagFromApi } from "@/lib/api";

export type TagMeta = {
  slug: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "tags-index.json");

let cached: TagMeta[] | null = null;

function getLegacyIndex(): TagMeta[] {
  if (!cached) {
    if (fs.existsSync(INDEX_PATH)) {
      cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as TagMeta[];
    } else {
      cached = [];
    }
  }
  return cached;
}

export function getAllTags(): TagMeta[] {
  return getLegacyIndex();
}

export function getTag(slug: string): TagMeta | null {
  const meta = getLegacyIndex().find((t) => t.slug === slug);
  if (!meta) return null;
  return meta;
}

export async function getTagData(slug: string) {
  return getTagFromApi(slug);
}
