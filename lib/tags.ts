import fs from "fs";
import path from "path";
import { readMainHtmlFile } from "@/lib/read-main-html";
import { getTagBySlug as getTagFromApi } from "@/lib/api";

export type TagMeta = {
  slug: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "tags-index.json");
const TAGS_DIR = path.join(process.cwd(), "content", "tags");

let cached: TagMeta[] | null = null;

function getLegacyIndex(): TagMeta[] {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as TagMeta[];
  }
  return cached;
}

export function getAllTags(): TagMeta[] {
  return getLegacyIndex();
}

export function getTag(slug: string): (TagMeta & { mainHtml: string }) | null {
  const meta = getLegacyIndex().find((t) => t.slug === slug);
  if (!meta) return null;

  const htmlPath = path.join(TAGS_DIR, `${slug}.html`);
  const mainHtml = readMainHtmlFile(htmlPath);
  if (!mainHtml) return null;

  return {
    ...meta,
    mainHtml,
  };
}

export async function getTagData(slug: string) {
  return getTagFromApi(slug);
}
