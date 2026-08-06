import fs from "fs";
import path from "path";
import { readMainHtmlFile } from "@/lib/read-main-html";

export type AuthorMeta = {
  slug: string;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "authors-index.json");
const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");

let cached: AuthorMeta[] | null = null;

function getIndex(): AuthorMeta[] {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as AuthorMeta[];
  }
  return cached;
}

export function getAllAuthors(): AuthorMeta[] {
  return getIndex();
}

export function getAuthor(slug: string): (AuthorMeta & { mainHtml: string }) | null {
  const meta = getIndex().find((a) => a.slug === slug);
  if (!meta) return null;

  const htmlPath = path.join(AUTHORS_DIR, `${slug}.html`);
  const mainHtml = readMainHtmlFile(htmlPath);
  if (!mainHtml) return null;

  return {
    ...meta,
    mainHtml,
  };
}
