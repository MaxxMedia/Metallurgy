import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageView } from "@/components/pages/StaticPageView";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { PageContainer } from "@/components/ui/PageContainer";
import { loadPagesFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const SLUG = "search";

export function generateMetadata(): Metadata {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) return reactNotFoundMetadata();
  return reactPageMetadata(page.title);
}

export default function SearchPage() {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) notFound();

  return (
    <ContentThemeLayout bodyClass={page.bodyClass ?? ""}>
      <PageContainer>
        <StaticPageView
          title={page.title}
          description={page.description}
          bodyHtml={page.bodyHtml}
        />
      </PageContainer>
    </ContentThemeLayout>
  );
}
