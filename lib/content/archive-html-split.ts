const ARCHIVE_PAGE_MARKER = '<div class="rstb-archive-page">';

/** Category archive template (elementor-6802). */
const CATEGORY_MAIN_COLUMN_MARKER = "elementor-element-329a25d";
/** Tag archive template (elementor-6577). */
const TAG_MAIN_COLUMN_MARKER = "elementor-element-fc07399";
/** Author archive template (elementor-6578). */
const AUTHOR_MAIN_COLUMN_MARKER = "elementor-element-d864673";

const MAIN_COLUMN_MARKERS = [
  CATEGORY_MAIN_COLUMN_MARKER,
  TAG_MAIN_COLUMN_MARKER,
  AUTHOR_MAIN_COLUMN_MARKER,
];

/** Post grid wrapper inside category main column (6802). */
const CATEGORY_GRID_INNER_MARKER = "elementor-element-cea81db";
/** Post grid wrapper inside tag main column (6577). */
const TAG_GRID_INNER_MARKER = "elementor-element-aecbbf5";

const PAGE_TITLE_MARKER = '<div class="rstb-page-title">';

function findMainColumnMarker(bodyHtml: string): string | null {
  for (const marker of MAIN_COLUMN_MARKERS) {
    if (bodyHtml.includes(marker)) return marker;
  }
  return null;
}

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


/** Index where the opening `<div` at `openIdx` closes (start of its `</div>`). */
function findClosingDivStart(html: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < html.length; i++) {
    if (html.startsWith("<div", i)) {
      depth++;
      i += 3;
      continue;
    }
    if (html.startsWith("</div", i)) {
      depth--;
      if (depth === 0) return i;
      i += 5;
      continue;
    }
  }
  return -1;
}

/** Sidebar widgets nested inside category/tag main column (after grid inner container). */
function extractNestedArchiveSidebarHtml(
  archiveHtml: string,
  gridInnerMarker: string,
  mainColumnMarker: string,
): string {
  const mainIdx = archiveHtml.indexOf(mainColumnMarker);
  const gridIdx = archiveHtml.indexOf(gridInnerMarker);
  if (mainIdx === -1 || gridIdx === -1) return "";

  const mainOpenIdx = archiveHtml.lastIndexOf("<div", mainIdx);
  const gridOpenIdx = archiveHtml.lastIndexOf("<div", gridIdx);
  if (mainOpenIdx === -1 || gridOpenIdx === -1) return "";

  const gridBlock = extractTopLevelDiv(archiveHtml.slice(gridOpenIdx));
  if (!gridBlock) return "";

  const sidebarStart = gridOpenIdx + gridBlock.length;
  const mainCloseIdx = findClosingDivStart(archiveHtml, mainOpenIdx);
  if (mainCloseIdx === -1 || sidebarStart >= mainCloseIdx) return "";

  return archiveHtml.slice(sidebarStart, mainCloseIdx).trim();
}

/** Sidebar column (Popular News, categories, tag cloud) from archive export. */
export function extractArchiveSidebarHtml(bodyHtml: string): string {
  const archiveIdx = bodyHtml.indexOf(ARCHIVE_PAGE_MARKER);
  const archiveHtml = archiveIdx === -1 ? bodyHtml : bodyHtml.slice(archiveIdx);

  const layoutKind = getArchiveLayoutKind(bodyHtml);

  if (layoutKind === "category") {
    const nested = extractNestedArchiveSidebarHtml(
      archiveHtml,
      CATEGORY_GRID_INNER_MARKER,
      CATEGORY_MAIN_COLUMN_MARKER,
    );
    if (nested) return nested;
  }

  if (layoutKind === "tag") {
    const nested = extractNestedArchiveSidebarHtml(
      archiveHtml,
      TAG_GRID_INNER_MARKER,
      TAG_MAIN_COLUMN_MARKER,
    );
    if (nested) return nested;
  }

  const mainColumnMarker = findMainColumnMarker(archiveHtml);
  if (!mainColumnMarker) return "";
  const mainIdx = archiveHtml.indexOf(mainColumnMarker);
  if (mainIdx === -1) return "";

  const openIdx = archiveHtml.lastIndexOf("<div", mainIdx);
  if (openIdx === -1) return "";


  const mainCloseIdx = findClosingDivStart(archiveHtml, openIdx);
  if (mainCloseIdx === -1) return "";

  const afterMain = archiveHtml.slice(mainCloseIdx + 6).trimStart();
  return extractTopLevelDiv(afterMain);
}

/** Author profile widget from author archive export (main column only). */
export function extractAuthorInfoHtml(bodyHtml: string): string {
  const archiveIdx = bodyHtml.indexOf(ARCHIVE_PAGE_MARKER);
  const scope = archiveIdx === -1 ? bodyHtml : bodyHtml.slice(archiveIdx);
  const widgetClassIdx = scope.indexOf("elementor-widget-rstb-post-author");
  if (widgetClassIdx === -1) return "";
  const openIdx = scope.lastIndexOf("<div", widgetClassIdx);
  if (openIdx === -1) return "";
  return extractTopLevelDiv(scope.slice(openIdx));
}

/** Page title band for non-archive Elementor pages (contact, about-us, etc.). */
export function extractMirrorPageTitleHtml(bodyHtml: string): string {
  if (!bodyHtml.trim()) return "";
  if (bodyHtml.includes(ARCHIVE_PAGE_MARKER)) {
    return extractArchivePageTitleHtml(bodyHtml);
  }
  const titleStart = bodyHtml.indexOf(PAGE_TITLE_MARKER);
  if (titleStart === -1) return "";
  return extractTopLevelDiv(bodyHtml.slice(titleStart));
}

/** Main column markup after the page title band. */
export function extractMirrorPageMainHtml(bodyHtml: string): string {
  if (!bodyHtml.trim()) return "";
  if (bodyHtml.includes(ARCHIVE_PAGE_MARKER)) {
    return bodyHtml.slice(bodyHtml.indexOf(ARCHIVE_PAGE_MARKER)).trim();
  }
  const titleStart = bodyHtml.indexOf(PAGE_TITLE_MARKER);
  if (titleStart === -1) return bodyHtml.trim();
  const titleBlock = extractTopLevelDiv(bodyHtml.slice(titleStart));
  return bodyHtml.slice(titleStart + titleBlock.length).trim();
}

export function hasArchiveLayout(bodyHtml?: string): boolean {
  if (!bodyHtml?.trim()) return false;
  return (

    bodyHtml.includes(ARCHIVE_PAGE_MARKER) && findMainColumnMarker(bodyHtml) !== null
  );
}

export type ArchiveLayoutKind = "category" | "tag" | "author";

export function getArchiveLayoutKind(bodyHtml: string): ArchiveLayoutKind | null {
  if (!hasArchiveLayout(bodyHtml)) return null;
  if (bodyHtml.includes(AUTHOR_MAIN_COLUMN_MARKER)) return "author";
  if (bodyHtml.includes(TAG_MAIN_COLUMN_MARKER)) return "tag";
  if (bodyHtml.includes(CATEGORY_MAIN_COLUMN_MARKER)) return "category";
  return null;
}
