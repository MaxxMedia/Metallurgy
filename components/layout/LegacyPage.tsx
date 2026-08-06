import { LegacyHtml } from "@/components/LegacyHtml";
import { LegacyHeadStyles } from "@/components/layout/LegacyHeadStyles";
import { LegacyScripts } from "@/components/layout/LegacyScripts";
import { BodyClass } from "@/components/layout/BodyClass";
import { optimizerCssPath, optimizerJsPath } from "@/lib/paths";
import type { InlineLegacyScript } from "@/types/site";

type LegacyPageProps = {
  mainHtml: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
  inlineScripts?: InlineLegacyScript[];
};

export function LegacyPage({
  mainHtml,
  bodyClass,
  cssHash,
  jsHash,
  inlineScripts,
}: LegacyPageProps) {
  return (
    <>
      <LegacyHeadStyles cssHref={optimizerCssPath(cssHash)} />
      <BodyClass className={bodyClass} />
      <LegacyHtml html={mainHtml} />
      <LegacyScripts
        jsBundle={optimizerJsPath(jsHash)}
        inlineScripts={inlineScripts}
      />
    </>
  );
}
