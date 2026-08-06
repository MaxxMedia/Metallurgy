import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getAllCategories, getCategory } from "@/lib/categories";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not Found" };
  return { title: category.title };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <LegacyPage
      mainHtml={category.mainHtml}
      bodyClass={category.bodyClass}
      cssHash={category.cssHash}
      jsHash={category.jsHash}
    />
  );
}
