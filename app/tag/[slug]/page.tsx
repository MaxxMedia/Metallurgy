import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getAllTags, getTag } from "@/lib/tags";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) return { title: "Not Found" };
  return { title: tag.title };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();

  return (
    <LegacyPage
      mainHtml={tag.mainHtml}
      bodyClass={tag.bodyClass}
      cssHash={tag.cssHash}
      jsHash={tag.jsHash}
    />
  );
}
