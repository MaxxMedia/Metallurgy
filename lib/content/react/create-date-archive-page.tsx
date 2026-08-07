import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryArchiveView } from "@/components/archive/CategoryArchiveView";
import { ElementorHtmlBody } from "@/components/content/ElementorHtmlBody";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { loadDateArchivesFile, loadPostsFile } from "@/lib/data-store";
import { reactPageMetadata } from "@/lib/content/react/metadata";

const ARCHIVE_BODY =
  "archive wp-theme-nerio scheme-light elementor-default elementor-kit-4659";
const YEAR = "2025";

export function createYearArchiveReactPage() {
  function generateMetadata(): Metadata {
    const archive = loadDateArchivesFile().archives.find(
      (a) => a.type === "year" && a.year === YEAR,
    );
    return reactPageMetadata(archive?.title ?? YEAR);
  }

  async function Page() {
    const archive = loadDateArchivesFile().archives.find(
      (a) => a.type === "year" && a.year === YEAR,
    );
    const [posts, authors, categories] = await Promise.all([
      getPosts(),
      getAuthors(),
      getCategories(),
    ]);
    const filtered = posts.filter((p) => p.year === YEAR);

    return (
      <ContentThemeLayout
        bodyClass={archive?.bodyClass ?? `${ARCHIVE_BODY} date date-year-${YEAR}`}
      >
        {archive?.bodyHtml ? (
          <ElementorHtmlBody html={archive.bodyHtml} />
        ) : (
          <CategoryArchiveView
            title={`Archive for ${YEAR}`}
            posts={filtered}
            authors={authors}
            categories={categories}
          />
        )}
      </ContentThemeLayout>
    );
  }

  return { Page, generateMetadata };
}

type MonthProps = { params: Promise<{ month: string }> };

export function createMonthArchiveReactPage() {
  function generateStaticParams() {
    const months = new Set(
      loadPostsFile()
        .posts.filter((p) => p.year === YEAR)
        .map((p) => p.month),
    );
    return [...months].map((month) => ({ month }));
  }

  async function generateMetadata({ params }: MonthProps): Promise<Metadata> {
    const { month } = await params;
    const archive = loadDateArchivesFile().archives.find(
      (a) => a.type === "month" && a.year === YEAR && a.month === month,
    );
    return reactPageMetadata(archive?.title ?? `${YEAR}/${month}`);
  }

  async function Page({ params }: MonthProps) {
    const { month } = await params;
    if (!/^\d{2}$/.test(month)) notFound();

    const archive = loadDateArchivesFile().archives.find(
      (a) => a.type === "month" && a.year === YEAR && a.month === month,
    );
    const [posts, authors, categories] = await Promise.all([
      getPosts(),
      getAuthors(),
      getCategories(),
    ]);
    const filtered = posts.filter((p) => p.year === YEAR && p.month === month);

    return (
      <ContentThemeLayout
        bodyClass={
          archive?.bodyClass ?? `${ARCHIVE_BODY} date date-month-${YEAR}-${month}`
        }
      >
        {archive?.bodyHtml ? (
          <ElementorHtmlBody html={archive.bodyHtml} />
        ) : (
          <CategoryArchiveView
            title={`Archive for ${YEAR}/${month}`}
            posts={filtered}
            authors={authors}
            categories={categories}
          />
        )}
      </ContentThemeLayout>
    );
  }

  return { Page, generateMetadata, generateStaticParams };
}

type DayProps = { params: Promise<{ month: string; day: string }> };

export function createDayArchiveReactPage() {
  function generateStaticParams() {
    const keys = new Set(
      loadPostsFile()
        .posts.filter((p) => p.year === YEAR)
        .map((p) => `${p.month}/${p.day}`),
    );
    return [...keys].map((key) => {
      const [month, day] = key.split("/");
      return { month, day };
    });
  }

  async function generateMetadata({ params }: DayProps): Promise<Metadata> {
    const { month, day } = await params;
    const archive = loadDateArchivesFile().archives.find(
      (a) =>
        a.type === "day" &&
        a.year === YEAR &&
        a.month === month &&
        a.day === day,
    );
    return reactPageMetadata(archive?.title ?? `${YEAR}/${month}/${day}`);
  }

  async function Page({ params }: DayProps) {
    const { month, day } = await params;
    if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) notFound();

    const archive = loadDateArchivesFile().archives.find(
      (a) =>
        a.type === "day" &&
        a.year === YEAR &&
        a.month === month &&
        a.day === day,
    );
    const [posts, authors, categories] = await Promise.all([
      getPosts(),
      getAuthors(),
      getCategories(),
    ]);
    const filtered = posts.filter(
      (p) => p.year === YEAR && p.month === month && p.day === day,
    );

    return (
      <ContentThemeLayout
        bodyClass={
          archive?.bodyClass ?? `${ARCHIVE_BODY} date date-day-${YEAR}-${month}-${day}`
        }
      >
        {archive?.bodyHtml ? (
          <ElementorHtmlBody html={archive.bodyHtml} />
        ) : (
          <CategoryArchiveView
            title={`Archive for ${YEAR}/${month}/${day}`}
            posts={filtered}
            authors={authors}
            categories={categories}
          />
        )}
      </ContentThemeLayout>
    );
  }

  return { Page, generateMetadata, generateStaticParams };
}
