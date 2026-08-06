import fs from "fs";
import path from "path";
import { readMainHtmlFile } from "@/lib/read-main-html";

export type DateArchiveMeta = {
  key: string;
  kind: "year" | "month" | "day";
  year: string;
  month: string | null;
  day: string | null;
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
};

const INDEX_PATH = path.join(process.cwd(), "content", "date-archives-index.json");
const ARCHIVES_DIR = path.join(process.cwd(), "content", "date-archives");

let cached: DateArchiveMeta[] | null = null;

function getIndex(): DateArchiveMeta[] {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as DateArchiveMeta[];
  }
  return cached;
}

function loadMainHtml(key: string): string | null {
  const htmlPath = path.join(ARCHIVES_DIR, `${key}.html`);
  return readMainHtmlFile(htmlPath);
}

export function getYearArchive(year: string) {
  const meta = getIndex().find((a) => a.kind === "year" && a.year === year);
  if (!meta) return null;
  const mainHtml = loadMainHtml(meta.key);
  if (!mainHtml) return null;
  return { ...meta, mainHtml };
}

export function getMonthArchive(year: string, month: string) {
  const meta = getIndex().find(
    (a) => a.kind === "month" && a.year === year && a.month === month,
  );
  if (!meta) return null;
  const mainHtml = loadMainHtml(meta.key);
  if (!mainHtml) return null;
  return { ...meta, mainHtml };
}

export function getDayArchive(year: string, month: string, day: string) {
  const meta = getIndex().find(
    (a) =>
      a.kind === "day" &&
      a.year === year &&
      a.month === month &&
      a.day === day,
  );
  if (!meta) return null;
  const mainHtml = loadMainHtml(meta.key);
  if (!mainHtml) return null;
  return { ...meta, mainHtml };
}

export function getAllMonthArchives() {
  return getIndex().filter((a) => a.kind === "month");
}

export function getAllDayArchives() {
  return getIndex().filter((a) => a.kind === "day");
}
