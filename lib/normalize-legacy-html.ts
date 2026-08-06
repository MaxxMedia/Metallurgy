/** Fix mirror markup that breaks SSR/client DOM parity (browser reparents tags differently). */
export function fixBrokenAuthorLinks(html: string): string {
  return html.replace(
    /(class="fpg-author-link">)([^<]+)<\/span><\/a>/g,
    "$1$2</a></span>",
  );
}

export function normalizeLegacyHtml(html: string): string {
  return fixBrokenAuthorLinks(html);
}
