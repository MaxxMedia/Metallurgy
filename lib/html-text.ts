export function decodeHtml(text: string): string {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

/** Title for Next metadata from mirror index `title` fields. */
export function legacyMetaTitle(raw: string): string {
  return decodeHtml(raw).replace(/\s*[–-]\s*Technology News Dark\s*$/i, "").trim();
}
