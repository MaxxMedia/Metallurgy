import { LegacyHtml } from "@/components/LegacyHtml";
import { ThemeLayout } from "@/components/layout/ThemeLayout";
import type { MirrorPagePayload } from "@/lib/content/types";
import type { InlineLegacyScript } from "@/types/site";

type MirrorMainPageProps = Pick<
  MirrorPagePayload,
  "mainHtml" | "bodyClass" | "cssHash" | "jsHash"
> & {
  inlineScripts?: InlineLegacyScript[];
};

/**
 * Renders extracted Elementor main markup inside the global SiteShell `<main>`.
 * Prefer migrating templates to React; use this for pixel-parity mirror HTML.
 */
export function MirrorMainPage({
  mainHtml,
  bodyClass,
  cssHash,
  jsHash,
  inlineScripts,
}: MirrorMainPageProps) {
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
