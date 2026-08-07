import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticPageView } from "@/components/pages/StaticPageView";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { loadPagesFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const SLUG = "about-us";

export function generateMetadata(): Metadata {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) return reactNotFoundMetadata();
  return reactPageMetadata(page.title);
}

export default function AboutUsPage() {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) notFound();

  return (
    <ContentThemeLayout bodyClass={page.bodyClass ?? ""}>
      <div className="mx-auto w-full max-w-6xl px-2.5 py-6">
        <StaticPageView
          title={page.title}
          description={page.description}
          bodyHtml={page.bodyHtml}
        />
      </div>
    </ContentThemeLayout>
  );
}
