const ARCHIVE_PAGE_MARKER = '<div class="rstb-archive-page">';
const MAIN_COLUMN_MARKER = "elementor-element-329a25d";

/** Page title + breadcrumb block from mirror export. */
export function extractArchivePageTitleHtml(bodyHtml: string): string {
  if (!bodyHtml.trim()) return "";
  const idx = bodyHtml.indexOf(ARCHIVE_PAGE_MARKER);
  if (idx === -1) return bodyHtml;
  return bodyHtml.slice(0, idx).trim();
}

function extractTopLevelDiv(html: string): string {
  const trimmed = html.trimStart();
  if (!trimmed.startsWith("<div")) return "";
  let depth = 0;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed.startsWith("<div", i)) {
      depth++;
      i += 3;
      continue;
    }
    if (trimmed.startsWith("</div", i)) {
      depth--;
      if (depth === 0) return trimmed.slice(0, i + 6);
      i += 5;
      continue;
    }
  }
  return trimmed;
}

/** Sidebar column (Popular News, categories, tag cloud) from archive export. */
export function extractArchiveSidebarHtml(bodyHtml: string): string {
  const archiveIdx = bodyHtml.indexOf(ARCHIVE_PAGE_MARKER);
  const archiveHtml = archiveIdx === -1 ? bodyHtml : bodyHtml.slice(archiveIdx);
  const mainIdx = archiveHtml.indexOf(MAIN_COLUMN_MARKER);
  if (mainIdx === -1) return "";

  const openIdx = archiveHtml.lastIndexOf("<div", mainIdx);
  if (openIdx === -1) return "";

  let depth = 0;
  for (let i = openIdx; i < archiveHtml.length; i++) {
    if (archiveHtml.startsWith("<div", i)) {
      depth++;
      i += 3;
      continue;
    }
    if (archiveHtml.startsWith("</div", i)) {
      depth--;
      if (depth === 0) {
        const afterMain = archiveHtml.slice(i + 6).trimStart();
        return extractTopLevelDiv(afterMain);
      }
      i += 5;
      continue;
    }
  }
  return "";
}

export function hasArchiveLayout(bodyHtml?: string): boolean {
  if (!bodyHtml?.trim()) return false;
  return (
    bodyHtml.includes(ARCHIVE_PAGE_MARKER) &&
    bodyHtml.includes(MAIN_COLUMN_MARKER)
  );
}
