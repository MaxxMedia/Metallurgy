import fs from "fs";
import path from "path";
import { normalizeLegacyHtml } from "@/lib/normalize-legacy-html";
import type { HeadStylesConfig, InlineLegacyScript } from "@/types/site";

const DATA_DIR = path.join(process.cwd(), "data");

export type ShellDataFile = {
  headerHtml: string;
  footerHtml: string;
  bodyTailHtml: string;
  homeMainHtml: string;
};

let shellCache: ShellDataFile | null = null;

export function loadShellFile(): ShellDataFile {
  if (!shellCache) {
    shellCache = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "shell.json"), "utf8"),
    ) as ShellDataFile;
  }
  return shellCache;
}

export function readShellHtml(
  part: "header" | "footer" | "body-tail" | "home-main",
): string {
  const shell = loadShellFile();
  const key =
    part === "header"
      ? "headerHtml"
      : part === "footer"
        ? "footerHtml"
        : part === "body-tail"
          ? "bodyTailHtml"
          : "homeMainHtml";
  return normalizeLegacyHtml(shell[key] ?? "");
}

/** @deprecated Use readShellHtml */
export function readExtractedHtml(
  name: "header" | "footer" | "home-main" | "body-tail",
): string {
  return readShellHtml(name);
}

export function readInlineLegacyScripts(): InlineLegacyScript[] {
  const filePath = path.join(DATA_DIR, "inline-scripts.json");
  if (!fs.existsSync(filePath)) return [];
  const all = JSON.parse(fs.readFileSync(filePath, "utf8")) as InlineLegacyScript[];
  return all.filter(
    (s) =>
      s.content.trim().startsWith("var ") ||
      s.content.trim().startsWith("window.") ||
      s.content.trim().startsWith("("),
  );
}

export function readHeadStylesConfig(): HeadStylesConfig {
  const raw = fs.readFileSync(path.join(DATA_DIR, "head-styles.json"), "utf8");
  return JSON.parse(raw) as HeadStylesConfig;
}
