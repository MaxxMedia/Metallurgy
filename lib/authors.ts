import fs from "fs";
import path from "path";

export type AuthorMeta = {
  slug: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "authors-index.json");

let cached: AuthorMeta[] | null = null;

function getIndex(): AuthorMeta[] {
  if (!cached) {
    if (fs.existsSync(INDEX_PATH)) {
      cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as AuthorMeta[];
    } else {
      cached = [];
    }
  }
  return cached;
}

export function getAllAuthors(): AuthorMeta[] {
  return getIndex();
}

export function getAuthor(slug: string): AuthorMeta | null {
  const meta = getIndex().find((a) => a.slug === slug);
  if (!meta) return null;
  return meta;
}
