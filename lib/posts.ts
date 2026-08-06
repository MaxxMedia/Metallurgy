import fs from "fs";
import path from "path";

export type PostMeta = {
  slug: string;
  year: string;
  month: string;
  day: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "posts-index.json");

let cachedIndex: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  if (!cachedIndex) {
    if (fs.existsSync(INDEX_PATH)) {
      cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as PostMeta[];
    } else {
      cachedIndex = [];
    }
  }
  return cachedIndex;
}

export function getPost(
  month: string,
  day: string,
  slug: string,
): PostMeta | null {
  const meta = getAllPosts().find(
    (p) => p.month === month && p.day === day && p.slug === slug,
  );
  if (!meta) return null;
  return meta;
}

export function postPath(meta: Pick<PostMeta, "year" | "month" | "day" | "slug">) {
  return `/${meta.year}/${meta.month}/${meta.day}/${meta.slug}`;
}
