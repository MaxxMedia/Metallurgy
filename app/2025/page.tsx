import type { Metadata } from "next";
import {
  loadYearArchivePage,
  mirrorNotFoundMetadata,
  mirrorPageMetadata,
  MirrorPageView,
  mirrorPageOrNotFound,
} from "@/lib/content";

const YEAR = "2025";

export function generateMetadata(): Metadata {
  const page = loadYearArchivePage(YEAR);
  if (!page) return mirrorNotFoundMetadata();
  return mirrorPageMetadata(page.title);
}

export default function YearArchivePage() {
  const page = mirrorPageOrNotFound(loadYearArchivePage(YEAR));
  return <MirrorPageView page={page} />;
}
