import { notFound } from "next/navigation";
import { MirrorMainPage } from "@/components/content/MirrorMainPage";
import type { MirrorPagePayload } from "@/lib/content/types";

export function MirrorPageView({ page }: { page: MirrorPagePayload }) {
  return (
    <MirrorMainPage
      mainHtml={page.mainHtml}
      bodyClass={page.bodyClass}
      cssHash={page.cssHash}
      jsHash={page.jsHash}
    />
  );
}

export function mirrorPageOrNotFound(
  page: MirrorPagePayload | null,
): MirrorPagePayload {
  if (!page) notFound();
  return page;
}
