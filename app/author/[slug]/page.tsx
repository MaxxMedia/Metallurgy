import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExtractedMainView } from "@/components/layout/ExtractedMainView";
import { getAllAuthors, getAuthor } from "@/lib/authors";
import { legacyMetaTitle } from "@/lib/html-text";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "Not Found" };
  return { title: legacyMetaTitle(author.title) };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  return (
    <ExtractedMainView
      mainHtml={author.mainHtml}
      bodyClass={author.bodyClass}
      cssHash={author.cssHash}
      jsHash={author.jsHash}
    />
  );
}
