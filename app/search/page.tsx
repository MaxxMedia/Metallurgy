import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getPage } from "@/lib/pages";

const SLUG = "search";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage(SLUG);
  if (!page) return { title: "Search" };
  return { title: page.title };
}

export default function SearchPage() {
  const page = getPage(SLUG);
  if (!page) notFound();

  return (
    <LegacyPage
      mainHtml={page.mainHtml}
      bodyClass={page.bodyClass}
      cssHash={page.cssHash}
      jsHash={page.jsHash}
    />
  );
}
