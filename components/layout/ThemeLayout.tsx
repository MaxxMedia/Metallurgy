import { LegacyHeadStyles } from "@/components/layout/LegacyHeadStyles";
import { LegacyScripts } from "@/components/layout/LegacyScripts";
import { BodyClass } from "@/components/layout/BodyClass";
import { optimizerCssPath, optimizerJsPath } from "@/lib/paths";
import { getHomePageAssets } from "@/lib/page-assets";
import type { InlineLegacyScript } from "@/types/site";

type ThemeLayoutProps = {
  bodyClass: string;
  cssHash?: string;
  jsHash?: string;
  inlineScripts?: InlineLegacyScript[];
  children: React.ReactNode;
};

const homeAssets = getHomePageAssets();

export function ThemeLayout({
  bodyClass,
  cssHash,
  jsHash,
  inlineScripts,
  children,
}: ThemeLayoutProps) {
  const extraCss =
    cssHash && cssHash !== homeAssets.cssHash
      ? optimizerCssPath(cssHash)
      : undefined;

  return (
    <>
      {extraCss ? <LegacyHeadStyles cssHref={extraCss} /> : null}
      <BodyClass className={bodyClass} />
      {children}
      {jsHash ? (
        <LegacyScripts
          jsBundle={optimizerJsPath(jsHash)}
          inlineScripts={inlineScripts}
        />
      ) : null}
    </>
  );
}
