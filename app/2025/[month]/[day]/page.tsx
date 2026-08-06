import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getAllDayArchives, getDayArchive } from "@/lib/date-archives";

type PageProps = {
  params: Promise<{ month: string; day: string }>;
};

export async function generateStaticParams() {
  return getAllDayArchives().map((archive) => ({
    month: archive.month!,
    day: archive.day!,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day } = await params;
  const archive = getDayArchive("2025", month, day);
  if (!archive) return { title: "Not Found" };
  return { title: archive.title };
}

export default async function DayArchivePage({ params }: PageProps) {
  const { month, day } = await params;
  const archive = getDayArchive("2025", month, day);
  if (!archive) notFound();

  return (
    <LegacyPage
      mainHtml={archive.mainHtml}
      bodyClass={archive.bodyClass}
      cssHash={archive.cssHash}
      jsHash={archive.jsHash}
    />
  );
}
