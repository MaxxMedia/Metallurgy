import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDayArchives } from "@/lib/date-archives";
import {
  loadDayArchivePage,
  mirrorNotFoundMetadata,
  mirrorPageMetadata,
  MirrorPageView,
  mirrorPageOrNotFound,
} from "@/lib/content";

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
  const page = loadDayArchivePage(YEAR, month, day);
  if (!page) return mirrorNotFoundMetadata();
  return mirrorPageMetadata(page.title);
}

export default async function DayArchivePage({ params }: PageProps) {
  const { month, day } = await params;
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) notFound();

  const page = mirrorPageOrNotFound(loadDayArchivePage(YEAR, month, day));
  return <MirrorPageView page={page} />;
}
