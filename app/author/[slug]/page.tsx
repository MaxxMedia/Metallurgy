import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveBodyOrGrid } from "@/lib/content/react/archive-body";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { loadAuthorsFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

const ARCHIVE_BODY =
  "archive wp-theme-nerio scheme-light elementor-default elementor-kit-4659";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return loadAuthorsFile().authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = loadAuthorsFile().authors.find((a) => a.slug === slug);
  if (!author) return reactNotFoundMetadata();
  return reactPageMetadata(author.name);
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = loadAuthorsFile().authors.find((a) => a.slug === slug);
  if (!author) notFound();

  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);
  const filtered = posts.filter((p) => p.authorId === author.id);

  return (
    <ContentThemeLayout
      bodyClass={author.bodyClass ?? `${ARCHIVE_BODY} author author-${author.slug}`}
      cssHash={author.cssHash}
      jsHash={author.jsHash}
    >
      <ArchiveBodyOrGrid
        kind="author"
        bodyHtml={author.bodyHtml}
        author={author}
        posts={filtered}
        authors={authors}
        categories={categories}
      />
    </ContentThemeLayout>
  );
}
