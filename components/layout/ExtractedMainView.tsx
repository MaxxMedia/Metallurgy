import { LegacyHtml } from "@/components/LegacyHtml";
import { ThemeLayout } from "@/components/layout/ThemeLayout";
import type { InlineLegacyScript } from "@/types/site";

type ExtractedMainViewProps = {
  mainHtml: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
  inlineScripts?: InlineLegacyScript[];
};

export function ExtractedMainView({
  mainHtml,
  bodyClass,
  cssHash,
  jsHash,
  inlineScripts,
}: ExtractedMainViewProps) {
  return (
    <ThemeLayout
      bodyClass={bodyClass}
      cssHash={cssHash}
      jsHash={jsHash}
      inlineScripts={inlineScripts}
    >
      <LegacyHtml html={mainHtml} />
    </ThemeLayout>
  );
}
