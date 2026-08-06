import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getPage } from "@/lib/pages";

const SLUG = "about-us";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPage(SLUG);
  if (!page) return { title: "Not Found" };
  return { title: page.title };
}

export default function AboutUsPage() {
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
