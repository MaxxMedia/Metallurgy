import { ThemeLayout } from "@/components/layout/ThemeLayout";
import { getArchivePageAssets } from "@/lib/page-assets";

type ArchiveThemeLayoutProps = {
  bodyExtra: string;
  children: React.ReactNode;
};

export function ArchiveThemeLayout({ bodyExtra, children }: ArchiveThemeLayoutProps) {
  const assets = getArchivePageAssets(bodyExtra);
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
