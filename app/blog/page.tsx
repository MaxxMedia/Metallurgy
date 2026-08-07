import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArchiveBodyOrGrid } from "@/lib/content/react/archive-body";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { getAuthors, getCategories, getPosts } from "@/lib/api";

import { loadPagesFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const SLUG = "blog";

export function generateMetadata(): Metadata {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) return reactNotFoundMetadata();
  return reactPageMetadata(page.title);
}


export default async function BlogPage() {
  const page = loadPagesFile().pages.find((p) => p.slug === SLUG);
  if (!page) notFound();

  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  return (
    <ContentThemeLayout
      bodyClass={page.bodyClass ?? ""}
      cssHash={page.cssHash}
      jsHash={page.jsHash}
    >
      <ArchiveBodyOrGrid
        kind="category"
        bodyHtml={page.bodyHtml}
        title="Blog"
        posts={posts}
        authors={authors}
        categories={categories}
      />

    </ContentThemeLayout>
  );
}
