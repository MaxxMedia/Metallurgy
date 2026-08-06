import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllMonthArchives } from "@/lib/date-archives";
import {
  loadMonthArchivePage,
  mirrorNotFoundMetadata,
  mirrorPageMetadata,
  MirrorPageView,
  mirrorPageOrNotFound,
} from "@/lib/content";

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
  const page = loadMonthArchivePage(YEAR, month);
  if (!page) return mirrorNotFoundMetadata();
  return mirrorPageMetadata(page.title);
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { month } = await params;
  if (!/^\d{2}$/.test(month)) notFound();

  const page = mirrorPageOrNotFound(loadMonthArchivePage(YEAR, month));
  return <MirrorPageView page={page} />;
}
