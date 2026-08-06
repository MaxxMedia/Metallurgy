import fs from "fs";
import path from "path";

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

let cached: DateArchiveMeta[] | null = null;

function getIndex(): DateArchiveMeta[] {
  if (!cached) {
    if (fs.existsSync(INDEX_PATH)) {
      cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as DateArchiveMeta[];
    } else {
      cached = [];
    }
  }
  return cached;
}

export function getYearArchive(year: string) {
  const meta = getIndex().find((a) => a.kind === "year" && a.year === year);
  if (!meta) return null;
  return meta;
}

export function getMonthArchive(year: string, month: string) {
  const meta = getIndex().find(
    (a) => a.kind === "month" && a.year === year && a.month === month,
  );
  if (!meta) return null;
  return meta;
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
  return meta;
}

export function getAllMonthArchives() {
  return getIndex().filter((a) => a.kind === "month");
}

export function getAllDayArchives() {
  return getIndex().filter((a) => a.kind === "day");
}
