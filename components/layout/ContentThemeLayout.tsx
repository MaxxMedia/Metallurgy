import { ThemeLayout } from "@/components/layout/ThemeLayout";
import { getArchivePageAssets } from "@/lib/page-assets";

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
  const assets = getArchivePageAssets(bodyClass, cssHash, jsHash);

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
