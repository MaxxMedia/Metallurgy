import { LegacyHtml } from "@/components/LegacyHtml";

type ElementorHtmlBodyProps = {
  html: string;
  className?: string;
};

/** Renders Elementor main-column markup from `data/*.json` (not filesystem HTML). */
export function ElementorHtmlBody({ html, className }: ElementorHtmlBodyProps) {
  if (!html.trim()) return null;
  return <LegacyHtml html={html} className={className} />;
}
