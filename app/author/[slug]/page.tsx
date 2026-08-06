import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getAllAuthors, getAuthor } from "@/lib/authors";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "Not Found" };
  return { title: author.title };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  return (
    <LegacyPage
      mainHtml={author.mainHtml}
      bodyClass={author.bodyClass}
      cssHash={author.cssHash}
      jsHash={author.jsHash}
    />
  );
}
