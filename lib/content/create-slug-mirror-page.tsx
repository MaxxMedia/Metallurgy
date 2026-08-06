import type { Metadata } from "next";
import { mirrorNotFoundMetadata, mirrorPageMetadata } from "@/lib/content/metadata";
import { MirrorPageView, mirrorPageOrNotFound } from "@/lib/content/mirror-page";
import type { MirrorPagePayload } from "@/lib/content/types";

type SlugMirrorPageConfig = {
  getAll: () => Array<{ slug: string }>;
  load: (slug: string) => MirrorPagePayload | null;
};

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function createSlugMirrorPage(config: SlugMirrorPageConfig) {
  function generateStaticParams() {
    return config.getAll().map((item) => ({ slug: item.slug }));
  }

  async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = config.load(slug);
    if (!page) return mirrorNotFoundMetadata();
    return mirrorPageMetadata(page.title);
  }

  async function Page({ params }: SlugPageProps) {
    const { slug } = await params;
    const page = mirrorPageOrNotFound(config.load(slug));
    return <MirrorPageView page={page} />;
  }

  return { Page, generateMetadata, generateStaticParams };
}
