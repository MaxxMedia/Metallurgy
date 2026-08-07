/** Re-exports shell + asset config from data JSON (no per-route HTML files). */
export {
  loadShellFile,
  readExtractedHtml,
  readHeadStylesConfig,
  readInlineLegacyScripts,
  readShellHtml,
} from "@/lib/shell-content";
export type { ShellDataFile } from "@/lib/shell-content";
