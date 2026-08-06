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

let cached: PageMeta[] | null = null;

function getIndex(): PageMeta[] {
  if (!cached) {
    if (fs.existsSync(INDEX_PATH)) {
      cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as PageMeta[];
    } else {
      cached = [
        { slug: "blog", title: "Blog - Technology News", bodyClass: "", cssHash: "", jsHash: "" },
        { slug: "about-us", title: "About Us - Technology News", bodyClass: "", cssHash: "", jsHash: "" },
        { slug: "contact", title: "Contact - Technology News", bodyClass: "", cssHash: "", jsHash: "" },
        { slug: "login", title: "Login - Technology News", bodyClass: "", cssHash: "", jsHash: "" },
        { slug: "register", title: "Register - Technology News", bodyClass: "", cssHash: "", jsHash: "" },
        { slug: "search", title: "Search - Technology News", bodyClass: "", cssHash: "", jsHash: "" },
      ];
    }
  }
  return cached;
}

export function getAllPages(): PageMeta[] {
  return getIndex();
}

export function getPage(slug: string): PageMeta | null {
  const meta = getIndex().find((p) => p.slug === slug);
  if (!meta) return null;
  return meta;
}
