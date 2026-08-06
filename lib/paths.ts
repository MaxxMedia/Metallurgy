export function publicAssetPath(relative: string): string {
  if (relative.startsWith("/")) return relative;
  return `/${relative.replace(/^\.\//, "")}`;
}

export function optimizerCssPath(hashOrPath: string): string {
  if (hashOrPath.includes("/")) {
    return publicAssetPath(hashOrPath);
  }
  return `/wp-content/uploads/sites/32/siteground-optimizer-assets/siteground-optimizer-combined-css-${hashOrPath}.css`;
}

export function optimizerJsPath(hash: string): string {
  return `/wp-content/uploads/sites/32/siteground-optimizer-assets/siteground-optimizer-combined-js-${hash}.js`;
}
