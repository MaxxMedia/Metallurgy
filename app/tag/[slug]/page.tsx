import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { legacyMetaTitle } from "@/lib/html-text";
import { getAllTags, getTag } from "@/lib/tags";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) return { title: "Not Found" };
  return { title: legacyMetaTitle(tag.title) };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();

  return (
    <ExtractedMainView
      mainHtml={tag.mainHtml}
      bodyClass={tag.bodyClass}
      cssHash={tag.cssHash}
      jsHash={tag.jsHash}
    />
  );
}
