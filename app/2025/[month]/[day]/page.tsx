import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { getAllDayArchives, getDayArchive } from "@/lib/date-archives";
import { legacyMetaTitle } from "@/lib/html-text";

type PageProps = {
  params: Promise<{ month: string; day: string }>;
};

const YEAR = "2025";

export function generateStaticParams() {
  return getAllDayArchives()
    .filter((a) => a.year === YEAR)
    .map((a) => ({ month: a.month!, day: a.day! }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day } = await params;
  const archive = getDayArchive(YEAR, month, day);
  if (!archive) return { title: "Not Found" };
  return { title: legacyMetaTitle(archive.title) };
}

export default async function DayArchivePage({ params }: PageProps) {
  const { month, day } = await params;
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) notFound();

  const archive = getDayArchive(YEAR, month, day);
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
