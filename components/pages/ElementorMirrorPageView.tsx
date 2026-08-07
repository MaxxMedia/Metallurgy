import { LegacyHtml } from "@/components/LegacyHtml";
import {
  extractMirrorPageMainHtml,
  extractMirrorPageTitleHtml,
} from "@/lib/content/archive-html-split";

type ElementorMirrorPageViewProps = {
  bodyHtml: string;
};

/** Full-width Elementor page from mirror HTML (title band + main content, no Tailwind prose wrapper). */
export function ElementorMirrorPageView({ bodyHtml }: ElementorMirrorPageViewProps) {
  const pageTitleHtml = extractMirrorPageTitleHtml(bodyHtml);
  const mainHtml = extractMirrorPageMainHtml(bodyHtml);

  return (
    <div className="w-full max-w-full text-[var(--titleColor)]">
      {pageTitleHtml ? <LegacyHtml html={pageTitleHtml} className="w-full" /> : null}
      {mainHtml ? <LegacyHtml html={mainHtml} className="w-full max-w-full" /> : null}
    </div>
  );
}
