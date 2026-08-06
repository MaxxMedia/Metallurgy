import { readExtractedHtml } from "@/lib/extracted-content";
import { LegacyHtml } from "@/components/LegacyHtml";

export function Footer() {
  const html = readExtractedHtml("footer");
  return <LegacyHtml html={html} displayContents />;
}
