import { LegacyHeadStyles } from "@/components/layout/LegacyHeadStyles";
import { getHomePageAssets } from "@/lib/page-assets";

/** Header/footer mirror markup always needs the home bundle CSS (nav, mega menu, ticker). */
export function ShellLegacyStyles() {
  const { cssHref } = getHomePageAssets();
  return <LegacyHeadStyles cssHref={cssHref} />;
}
