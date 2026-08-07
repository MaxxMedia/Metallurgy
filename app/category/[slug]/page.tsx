import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveBodyOrGrid } from "@/lib/content/react/archive-body";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { loadCategoriesFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const ARCHIVE_BODY =
  "archive wp-theme-nerio scheme-light elementor-default elementor-kit-4659";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return loadCategoriesFile().categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = loadCategoriesFile().categories.find((c) => c.slug === slug);
  if (!category) return reactNotFoundMetadata();
  return reactPageMetadata(category.name);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = loadCategoriesFile().categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);
  const filtered = posts.filter((p) => p.categorySlug === slug);

  return (
    <ContentThemeLayout
      bodyClass={category.bodyClass ?? `${ARCHIVE_BODY} category category-${category.slug}`}
      cssHash={category.cssHash}
      jsHash={category.jsHash}
    >
      <ArchiveBodyOrGrid
        kind="category"
        bodyHtml={category.bodyHtml}
        title={category.name}
        posts={filtered}
        authors={authors}
        categories={categories}
      />
    </ContentThemeLayout>
  );
}
