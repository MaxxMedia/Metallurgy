/** Fix mirror markup that breaks SSR/client DOM parity (browser reparents tags differently). */
export function fixBrokenAuthorLinks(html: string): string {
  return html.replace(
    /(class="fpg-author-link">)([^<]+)<\/span><\/a>/g,
    "$1$2</a></span>",
  );
}

/** Strip demo host and fix known wrong upload paths in shell markup. */
export function normalizeMirrorUrls(html: string): string {
  let out = html.replace(
    /https:\/\/nerio\.rstheme\.com\/technology-news-dark/g,
    "",
  );

  const site5Fallbacks: [RegExp, string][] = [
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

export function normalizeLegacyHtml(html: string): string {
  return normalizeMirrorUrls(fixBrokenAuthorLinks(html));
}
