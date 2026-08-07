import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageView } from "@/components/pages/StaticPageView";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { loadPagesFile } from "@/lib/data-store";
import type { StaticPageSlug } from "@/types/data";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

export function createStaticReactPage(slug: StaticPageSlug) {
  function Page() {
    const page = loadPagesFile().pages.find((p) => p.slug === slug);
    if (!page) notFound();

    return (
      <ContentThemeLayout bodyClass={page.bodyClass}>
        <StaticPageView
          title={page.title}
          description={page.description}
          bodyHtml={page.bodyHtml}
        />
      </ContentThemeLayout>
    );
  }

  function generateMetadata(): Metadata {
    const page = loadPagesFile().pages.find((p) => p.slug === slug);
    if (!page) return reactNotFoundMetadata();
    return reactPageMetadata(page.title);
  }

  return { Page, generateMetadata };
}
