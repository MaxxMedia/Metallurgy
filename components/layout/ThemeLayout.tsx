import { LegacyHeadStyles } from "@/components/layout/LegacyHeadStyles";
import { LegacyScripts } from "@/components/layout/LegacyScripts";
import { BodyClass } from "@/components/layout/BodyClass";
import { optimizerCssPath, optimizerJsPath } from "@/lib/paths";
import type { InlineLegacyScript } from "@/types/site";

type ThemeLayoutProps = {
  bodyClass: string;
  cssHash: string;
  jsHash: string;
  inlineScripts?: InlineLegacyScript[];
  children: React.ReactNode;
};

export function ThemeLayout({
  bodyClass,
  cssHash,
  jsHash,
  inlineScripts,
  children,
}: ThemeLayoutProps) {
  return (
    <>
      <LegacyHeadStyles cssHref={optimizerCssPath(cssHash)} />
      <BodyClass className={bodyClass} />
      {children}
      <LegacyScripts
        jsBundle={optimizerJsPath(jsHash)}
        inlineScripts={inlineScripts}
      />
    </>
  );
}
