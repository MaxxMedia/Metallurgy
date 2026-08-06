import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getYearArchive } from "@/lib/date-archives";

const YEAR = "2025";

export async function generateMetadata(): Promise<Metadata> {
  const archive = getYearArchive(YEAR);
  if (!archive) return { title: "Not Found" };
  return { title: archive.title };
}

export default function YearArchivePage() {
  const archive = getYearArchive(YEAR);
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
