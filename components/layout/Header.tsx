import { readExtractedHtml } from "@/lib/extracted-content";
import { LegacyHtml } from "@/components/LegacyHtml";

export function Header() {
  const html = readExtractedHtml("header");
  return <LegacyHtml html={html} displayContents />;
}
