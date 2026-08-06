import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { getYearArchive } from "@/lib/date-archives";
import { legacyMetaTitle } from "@/lib/html-text";

const YEAR = "2025";

export function generateMetadata(): Metadata {
  const archive = getYearArchive(YEAR);
  if (!archive) return { title: "Not Found" };
  return { title: legacyMetaTitle(archive.title) };
}

export default function YearArchivePage() {
  const archive = getYearArchive(YEAR);
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
