import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getAllMonthArchives, getMonthArchive } from "@/lib/date-archives";

type PageProps = {
  params: Promise<{ month: string }>;
};

export async function generateStaticParams() {
  return getAllMonthArchives().map((archive) => ({
    month: archive.month!,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month } = await params;
  const archive = getMonthArchive("2025", month);
  if (!archive) return { title: "Not Found" };
  return { title: archive.title };
}

export default async function MonthArchivePage({ params }: PageProps) {
  const { month } = await params;
  const archive = getMonthArchive("2025", month);
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
