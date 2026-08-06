import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { getAllCategories, getCategory } from "@/lib/categories";
import { legacyMetaTitle } from "@/lib/html-text";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not Found" };
  return { title: legacyMetaTitle(category.title) };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <ExtractedMainView
      mainHtml={category.mainHtml}
      bodyClass={category.bodyClass}
      cssHash={category.cssHash}
      jsHash={category.jsHash}
    />
  );
}
