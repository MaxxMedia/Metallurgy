import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_UPLOADS_ROOT = path.resolve(
  __dirname,
  "../../../technology-news-dark/wp-content/uploads",
);
const PUBLIC_UPLOADS_ROOT = path.resolve(
  __dirname,
  "../../public/wp-content/uploads",
);

export const FALLBACK_UPLOAD_IMAGE =
  "/wp-content/uploads/sites/32/2025/10/tech_12-min-768x381.jpg";

const UPLOAD_URL_RE =
  /\/wp-content\/uploads\/[^\s"'<>)]+\.(?:jpg|jpeg|png|webp|gif)/gi;

function parseUploadUrl(urlPath) {
  const rel = urlPath.replace(/^\/wp-content\/uploads\//, "");
  const filename = path.basename(rel);
  const dirRel = path.dirname(rel);
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  const sizeMatch = base.match(/^(.+)-(\d+x\d+)$/);
  return {
    rel,
    dirRel,
    filename,
    ext,
    stem: sizeMatch ? sizeMatch[1] : base,
    hasSizeSuffix: Boolean(sizeMatch),
  };
}

function listDirFiles(uploadsRoot, dirRel) {
  const absDir = path.join(uploadsRoot, dirRel);
  if (!fs.existsSync(absDir)) return [];
  return fs.readdirSync(absDir);
}

function pickBestFile(files, stem, ext) {
  const priorities = [
    `${stem}-768x381${ext}`,
    `${stem}-1200x650${ext}`,
    `${stem}-1024x508${ext}`,
    `${stem}-500x500${ext}`,
    `${stem}-150x150${ext}`,
    `${stem}${ext}`,
  ];
  for (const name of priorities) {
    if (files.includes(name)) return name;
  }
  const loose = files.find(
    (f) => f.startsWith(stem) && f.toLowerCase().endsWith(ext.toLowerCase()),
  );
  return loose ?? null;
}

/** Map WP responsive URLs to the closest file present in the static mirror. */
export function resolveUploadUrl(urlPath, uploadsRoot = DEFAULT_UPLOADS_ROOT) {
  if (!urlPath.startsWith("/wp-content/uploads/")) return urlPath;

  const parsed = parseUploadUrl(urlPath);
  const files = listDirFiles(uploadsRoot, parsed.dirRel);
  if (!files.length) return FALLBACK_UPLOAD_IMAGE;

  const abs = path.join(uploadsRoot, parsed.rel);
  if (fs.existsSync(abs)) return urlPath;

  const best = pickBestFile(files, parsed.stem, parsed.ext);
  if (!best) return FALLBACK_UPLOAD_IMAGE;

  return `/wp-content/uploads/${parsed.dirRel}/${best}`.replace(/\\/g, "/");
}

export function resolveUploadUrlForPublic(urlPath) {
  return resolveUploadUrl(urlPath, PUBLIC_UPLOADS_ROOT);
}

const MISSING_SIZE_REPLACEMENTS = [
  [/-500x500\.(jpg|jpeg|png|webp)/gi, "-768x381.$1"],
  [/-1024x508\.(jpg|jpeg|png|webp)/gi, "-768x381.$1"],
  [/-1024x476\.(jpg|jpeg|png|webp)/gi, "-768x381.$1"],
];

export function fixUploadImageUrls(html, uploadsRoot = DEFAULT_UPLOADS_ROOT) {
  let out = html;
  for (const [pattern, replacement] of MISSING_SIZE_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(UPLOAD_URL_RE, (url) =>
    resolveUploadUrl(url, uploadsRoot),
  );
}

/** Broken author markup from WP export confuses HTML parsers during hydration. */
export function fixBrokenAuthorLinks(html) {
  return html.replace(
    /(class="fpg-author-link">)([^<]+)<\/span><\/a>/g,
    "$1$2</a></span>",
  );
}

export function rewriteHtml(html, uploadsRoot = DEFAULT_UPLOADS_ROOT) {
  return fixBrokenAuthorLinks(
    fixUploadImageUrls(
    normalizeMirrorUrls(
      html
        .replace(/\b(src|href)="wp-content\//g, '$1="/wp-content/')
        .replace(/\b(src|href)="\.\.\/wp-content\//g, '$1="/wp-content/')
        .replace(/\b(src|href)="\.\.\/\.\.\/wp-content\//g, '$1="/wp-content/')
        .replace(/\b(src|href)="\.\.\/\.\.\/\.\.\/wp-content\//g, '$1="/wp-content/')
        .replace(/\b(src|href)="\.\.\/\.\.\/\.\.\/\.\.\/wp-content\//g, '$1="/wp-content/')
        .replace(/\bsrc="wp-includes\//g, 'src="/wp-includes/')
        .replace(/\bhref="wp-includes\//g, 'href="/wp-includes/')
        .replace(/url\(wp-content\//g, "url(/wp-content/")
        .replace(/url\(\.\.\/wp-content\//g, "url(/wp-content/")
        .replace(/url\(\.\.\/\.\.\/wp-content\//g, "url(/wp-content/")
        .replace(/url\(\.\.\/\.\.\/\.\.\/wp-content\//g, "url(/wp-content/")
        .replace(/url\(\.\.\/\.\.\/\.\.\/\.\.\/wp-content\//g, "url(/wp-content/")
        .replace(/href="index\.html"/g, 'href="/"')
        .replace(/href="([^"]+)\/index\.html"/g, (_, p) => {
          if (p.startsWith("http") || p.startsWith("/") || p.startsWith("#")) {
            return `href="${p}"`;
          }
          const cleaned = p.replace(/^(\.\.\/)+/, "");
          return `href="/${cleaned}"`;
        })
        .replace(/href="\.\.\/([^"]+)"/g, 'href="/$1"')
        .replace(/href="\.\.\/\.\.\/([^"]+)"/g, 'href="/$1"')
        .replace(
          /href="https:\/\/nerio\.rstheme\.com\/technology-news-dark\/?"/g,
          'href="/"',
        )
        .replace(
          /action="https:\/\/nerio\.rstheme\.com\/technology-news-dark\/"/g,
          'action="/search"',
        ),
    ),
    uploadsRoot,
  ),
  );
}

/** Strip demo host and fix srcset / missing multisite uploads for local public/. */
export function normalizeMirrorUrls(html) {
  let out = html.replace(
    /https:\/\/nerio\.rstheme\.com\/technology-news-dark/g,
    "",
  );

  const site5Fallbacks = [
    [
      /\/wp-content\/uploads\/sites\/5\/2025\/11\/logo\.png/g,
      "/wp-content/uploads/sites/32/2025/11/logo.png",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/cta-thumb-01\.png/g,
      "/wp-content/uploads/sites/32/2025/11/tech_01-min-768x381.jpg",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/cta-thumb-02\.png/g,
      "/wp-content/uploads/sites/32/2025/11/tech_02-min-768x381.jpg",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/cta-thumb-03\.png/g,
      "/wp-content/uploads/sites/32/2025/11/tech_03-min-768x381.jpg",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/cta-thumb-04\.png/g,
      "/wp-content/uploads/sites/32/2025/11/tech_04-min-768x381.jpg",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/newsletter-dot\.png/g,
      "/wp-content/themes/nerio/assets/img/quote.svg",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/spp_01\.png/g,
      "/wp-content/uploads/sites/32/2025/10/tech_12-min-768x381.jpg",
    ],
    [
      /\/wp-content\/uploads\/sites\/5\/2026\/02\/spp_02\.png/g,
      "/wp-content/uploads/sites/32/2025/10/tech_13-min-768x381.jpg",
    ],
  ];

  for (const [pattern, replacement] of site5Fallbacks) {
    out = out.replace(pattern, replacement);
  }

  return out;
}

export function extractMainHtml(raw) {
  const mainStart = raw.indexOf("<main");
  const footerStart = raw.indexOf('<footer class="rstb-footer">');
  if (mainStart === -1 || footerStart === -1) return null;

  const mainOpenEnd = raw.indexOf(">", mainStart) + 1;
  return raw.slice(mainOpenEnd, footerStart);
}

export function extractPageMeta(raw, defaults) {
  const titleMatch = raw.match(/<title>([^<]*)<\/title>/i);
  const bodyMatch = raw.match(/<body class="([^"]*)"/);
  const cssMatch = raw.match(/siteground-optimizer-combined-css-([a-f0-9]+)/);
  const jsMatch = raw.match(/siteground-optimizer-combined-js-([a-f0-9]+)/);

  return {
    title: titleMatch ? titleMatch[1].trim() : defaults.title,
    bodyClass: bodyMatch ? bodyMatch[1] : defaults.bodyClass,
    cssHash: cssMatch ? cssMatch[1] : defaults.cssHash,
    jsHash: jsMatch ? jsMatch[1] : defaults.jsHash,
  };
}
