import fs from "fs";
import path from "path";
import { rewriteHtml } from "./lib/rewrite-html.mjs";

const SOURCE = path.resolve("../technology-news-dark/index.html");
const DATA = path.resolve("data");
const shellPath = path.join(DATA, "shell.json");

if (!fs.existsSync(SOURCE)) {
  if (fs.existsSync(shellPath)) {
    console.log("No mirror index.html — keeping existing data/shell.json");
    process.exit(0);
  }
  console.error("Missing ../technology-news-dark/index.html and data/shell.json");
  process.exit(1);
}

const raw = fs.readFileSync(SOURCE, "utf8");

const headerStart = raw.indexOf('<header class="rstb-header">');
const mainStart = raw.indexOf("<main");
const footerStart = raw.indexOf('<footer class="rstb-footer">');
const footerEnd = raw.indexOf("</footer>", footerStart);

if ([headerStart, mainStart, footerStart, footerEnd].some((i) => i === -1)) {
  console.error("Could not find shell markers", {
    headerStart,
    mainStart,
    footerStart,
    footerEnd,
  });
  process.exit(1);
}

const mainOpenEnd = raw.indexOf(">", mainStart) + 1;
const header = raw.slice(headerStart, mainStart);
const mainInner = raw.slice(mainOpenEnd, footerStart);
const footer = raw.slice(footerStart, footerEnd + "</footer>".length);

const headEnd = raw.indexOf("</head>");
const head = raw.slice(0, headEnd);

const styleBlocks = [];
const inlineStyleRegex =
  /<style[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/style>/gi;
let m;
while ((m = inlineStyleRegex.exec(head))) {
  styleBlocks.push({ id: m[1], content: m[2] });
}

const linkRegex =
  /<link rel="stylesheet"[^>]*href="([^"]*siteground-optimizer-combined-css-[^"]+)"[^>]*>/i;
const linkMatch = head.match(linkRegex);
const cssHref = linkMatch ? linkMatch[1] : null;

const fontStyleMatch = head.match(
  /<style type="text\/css">(@font-face[\s\S]*?)<\/style>/i,
);
const fontFaces = fontStyleMatch ? fontStyleMatch[1] : "";

const elementorLazyMatch = head.match(
  /<style>\s*(\.e-con\.e-parent[\s\S]*?)<\/style>/,
);
const elementorLazyCss = elementorLazyMatch ? elementorLazyMatch[1] : "";

const bodyEnd = raw.lastIndexOf("</body>");
const afterFooter = raw.slice(footerEnd + "</footer>".length, bodyEnd);
const combinedScriptMatch = afterFooter.match(
  /<script defer src="wp-content\/uploads[^"]*siteground-optimizer-combined-js-([a-f0-9]+)\.js"><\/script>/,
);
const combinedIdx = combinedScriptMatch
  ? afterFooter.indexOf(combinedScriptMatch[0])
  : -1;

let bodyTailRaw = combinedIdx >= 0 ? afterFooter.slice(0, combinedIdx) : "";
bodyTailRaw = bodyTailRaw.replace(/^\s*<\/div>\s*/, "");
bodyTailRaw = bodyTailRaw
  .replace(/<!-- Sidebar Preview Start -->[\s\S]*?<!-- Sidebar Preview End -->/g, "")
  .replace(/<ul class="panel-btn-part sidebar-icon">[\s\S]*?<\/ul>/, "");

const inlineScripts = [];
const inlineScriptRe =
  /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
let scriptMatch;
const tailForScripts = bodyTailRaw;
while ((scriptMatch = inlineScriptRe.exec(tailForScripts))) {
  const attrs = scriptMatch[1];
  const content = scriptMatch[2].trim();
  if (!content) continue;
  if (attrs.includes("speculationrules")) continue;
  if (content.startsWith("{")) continue;
  const idMatch = attrs.match(/\bid="([^"]+)"/);
  inlineScripts.push({
    id: idMatch ? idMatch[1] : `inline-${inlineScripts.length}`,
    content,
  });
}

bodyTailRaw = bodyTailRaw.replace(inlineScriptRe, "");

function rewriteBootScript(content) {
  return content
    .replace(/https:\/\/nerio\.rstheme\.com\/technology-news-dark/g, "")
    .replace(/https:\\\/\\\/nerio\.rstheme\.com\\\/technology-news-dark/g, "")
    .replace(
      /\\\/wp-content\\\/plugins\\\/elementor\\\/assets\\\//g,
      "\\/wp-content\\/plugins\\/elementor\\/assets\\/",
    )
    .replace(
      /"ajax_url":"\/wp-admin\/admin-ajax\.php"/g,
      '"ajax_url":"/api/home/load-more"',
    )
    .replace(
      /"ajaxUrl":"\/wp-admin\/admin-ajax\.php"/g,
      '"ajaxUrl":"/api/home/load-more"',
    );
}

const jsBundle = combinedScriptMatch ? combinedScriptMatch[1] : null;

fs.mkdirSync(DATA, { recursive: true });

fs.writeFileSync(
  path.join(DATA, "shell.json"),
  JSON.stringify(
    {
      headerHtml: rewriteHtml(header),
      footerHtml: rewriteHtml(footer),
      bodyTailHtml: rewriteHtml(bodyTailRaw),
      homeMainHtml: rewriteHtml(mainInner),
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(DATA, "inline-scripts.json"),
  JSON.stringify(
    inlineScripts.map((s) => ({
      ...s,
      content: rewriteBootScript(s.content),
    })),
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(DATA, "head-styles.json"),
  JSON.stringify(
    {
      cssHref,
      jsBundle,
      fontFaces,
      elementorLazyCss,
      styleBlocks,
    },
    null,
    2,
  ),
);

console.log("Wrote shell + assets to", DATA);
console.log("CSS bundle:", cssHref);
console.log("JS bundle:", jsBundle);
