import { ThemeLayout } from "@/components/layout/ThemeLayout";
import { getArchivePageAssets, getSinglePostAssets } from "@/lib/page-assets";

type ContentThemeLayoutProps = {
  children: React.ReactNode;
  bodyClass: string;
  cssHash?: string;
  jsHash?: string;
};

export function ContentThemeLayout({
  children,
  bodyClass,
  cssHash,
  jsHash,
}: ContentThemeLayoutProps) {
  const assets =
    cssHash && jsHash
      ? getSinglePostAssets(cssHash, jsHash)
      : getArchivePageAssets(bodyClass);

  return (
    <ThemeLayout
      bodyClass={assets.bodyClass}
      cssHash={assets.cssHash}
      jsHash={assets.jsHash}
    >
      {children}
    </ThemeLayout>
  );
}
