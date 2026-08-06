import type { Metadata } from "next";
import { mirrorNotFoundMetadata, mirrorPageMetadata } from "@/lib/content/metadata";
import { loadStaticPage } from "@/lib/content/load-mirror-content";
import { MirrorPageView, mirrorPageOrNotFound } from "@/lib/content/mirror-page";
import type { StaticPageSlug } from "@/lib/content/types";

export function createStaticMirrorPage(slug: StaticPageSlug) {
  function Page() {
    const page = mirrorPageOrNotFound(loadStaticPage(slug));
    return <MirrorPageView page={page} />;
  }

  function generateMetadata(): Metadata {
    const page = loadStaticPage(slug);
    if (!page) return mirrorNotFoundMetadata();
    return mirrorPageMetadata(page.title);
  }

  return { Page, generateMetadata };
}
