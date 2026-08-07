import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveBodyOrGrid } from "@/lib/content/react/archive-body";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { PageContainer } from "@/components/ui/PageContainer";

import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { loadTagsFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const ARCHIVE_BODY =
  "archive wp-theme-nerio scheme-light elementor-default elementor-kit-4659";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return loadTagsFile().tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = loadTagsFile().tags.find((t) => t.slug === slug);
  if (!tag) return reactNotFoundMetadata();
  return reactPageMetadata(tag.name);
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = loadTagsFile().tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);
  const filtered = posts.filter((p) => p.tagIds.includes(tag.id));

  return (

    <ContentThemeLayout
      bodyClass={tag.bodyClass ?? `${ARCHIVE_BODY} tag tag-${tag.slug}`}
      cssHash={tag.cssHash}
      jsHash={tag.jsHash}
    >
      <ArchiveBodyOrGrid
        kind="tag"
        bodyHtml={tag.bodyHtml}
        title={tag.name}
        posts={filtered}
        authors={authors}
        categories={categories}
      />

    </ContentThemeLayout>
  );
}
