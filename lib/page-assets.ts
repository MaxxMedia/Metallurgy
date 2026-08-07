import type { PageAssets } from "@/types/site";
import { optimizerCssPath, optimizerJsPath, publicAssetPath } from "@/lib/paths";
import { readHeadStylesConfig } from "@/lib/extracted-content";

const BASE_BODY =
  "wp-theme-nerio scheme-light elementor-default elementor-kit-4659";

export function getHomePageAssets(): PageAssets {
  const head = readHeadStylesConfig();
  if (!head.cssHref || !head.jsBundle) {
    throw new Error("Home page asset bundles missing from head-styles.json");
  }
  const cssMatch = head.cssHref.match(/combined-css-([a-f0-9]+)/);
  const cssHash = cssMatch ? cssMatch[1] : "401bcdbaf8365cbf5a3e479a0f993905";
  return {
    cssHref: publicAssetPath(head.cssHref),
    jsBundle: optimizerJsPath(head.jsBundle),
    cssHash,
    jsHash: head.jsBundle,
    bodyClass: `${BASE_BODY} home wp-singular page-template page-template-elementor_header_footer page page-id-302 elementor-template-full-width elementor-page elementor-page-302`,
  };
}

/** Default archive / inner page bundles (tag/category/blog) from mirror */
export function getArchivePageAssets(
  bodyClass: string,
  cssHash?: string,
  jsHash?: string,
): PageAssets {
  const resolvedCssHash = cssHash ?? "3fd97b5895d425cb30e9cdb60d4e22de";
  const resolvedJsHash = jsHash ?? "835be14e8b2b7249773f157bfb1c02dc";
  const normalizedBody = bodyClass.includes("wp-theme-nerio")
    ? bodyClass
    : `${BASE_BODY} ${bodyClass}`;
  return {
    cssHref: optimizerCssPath(resolvedCssHash),
    jsBundle: optimizerJsPath(resolvedJsHash),
    cssHash: resolvedCssHash,
    jsHash: resolvedJsHash,
    bodyClass: normalizedBody,
  };
}

export function getSinglePostAssets(cssHash: string, jsHash: string): PageAssets {
  return {
    cssHref: optimizerCssPath(cssHash),
    jsBundle: optimizerJsPath(jsHash),
    cssHash,
    jsHash,
    bodyClass: `${BASE_BODY} wp-singular post-template-default single single-post single-format-standard`,
  };
}
