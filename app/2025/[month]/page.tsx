import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { getAllMonthArchives, getMonthArchive } from "@/lib/date-archives";
import { legacyMetaTitle } from "@/lib/html-text";

type PageProps = {
  params: Promise<{ month: string }>;
};

const YEAR = "2025";

export function generateStaticParams() {
  return getAllMonthArchives()
    .filter((a) => a.year === YEAR)
    .map((a) => ({ month: a.month! }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month } = await params;
  const archive = getMonthArchive(YEAR, month);
  if (!archive) return { title: "Not Found" };
  return { title: legacyMetaTitle(archive.title) };
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { month } = await params;
  if (!/^\d{2}$/.test(month)) notFound();

  const archive = getMonthArchive(YEAR, month);
  if (!archive) notFound();

  return (
    <ExtractedMainView
      mainHtml={archive.mainHtml}
      bodyClass={archive.bodyClass}
      cssHash={archive.cssHash}
      jsHash={archive.jsHash}
    />
  );
}
