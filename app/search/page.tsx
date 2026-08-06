import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { legacyMetaTitle } from "@/lib/html-text";
import { getPage } from "@/lib/pages";

const SLUG = "search";

export function generateMetadata(): Metadata {
  const page = getPage(SLUG);
  if (!page) return { title: "Not Found" };
  return { title: legacyMetaTitle(page.title) };
}

export default function SearchPage() {
  const page = getPage(SLUG);
  if (!page) notFound();

  return (
    <ExtractedMainView
      mainHtml={page.mainHtml}
      bodyClass={page.bodyClass}
      cssHash={page.cssHash}
      jsHash={page.jsHash}
    />
  );
}
