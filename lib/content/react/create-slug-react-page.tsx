import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { loadAuthorsFile, loadCategoriesFile, loadTagsFile } from "@/lib/data-store";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";
import { ArchiveBodyOrGrid } from "@/lib/content/react/archive-body";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

const ARCHIVE_BODY =
  "archive wp-theme-nerio scheme-light elementor-default elementor-kit-4659";

export function createCategoryReactPage() {
  function generateStaticParams() {
    return loadCategoriesFile().categories.map((c) => ({ slug: c.slug }));
  }

  async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = loadCategoriesFile().categories.find((c) => c.slug === slug);
    if (!category) return reactNotFoundMetadata();
    return reactPageMetadata(category.name);
  }

  async function Page({ params }: SlugPageProps) {
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

  return { Page, generateMetadata, generateStaticParams };
}

export function createTagReactPage() {
  function generateStaticParams() {
    return loadTagsFile().tags.map((t) => ({ slug: t.slug }));
  }

  async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tag = loadTagsFile().tags.find((t) => t.slug === slug);
    if (!tag) return reactNotFoundMetadata();
    return reactPageMetadata(tag.name);
  }

  async function Page({ params }: SlugPageProps) {
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

  return { Page, generateMetadata, generateStaticParams };
}

export function createAuthorReactPage() {
  function generateStaticParams() {
    return loadAuthorsFile().authors.map((a) => ({ slug: a.slug }));
  }

  async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const { slug } = await params;
    const author = loadAuthorsFile().authors.find((a) => a.slug === slug);
    if (!author) return reactNotFoundMetadata();
    return reactPageMetadata(author.name);
  }

  async function Page({ params }: SlugPageProps) {
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

  return { Page, generateMetadata, generateStaticParams };
}
