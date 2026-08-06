import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { getAllPosts, getPost } from "@/lib/posts";

type PageProps = {
  params: Promise<{ month: string; day: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day, slug } = await params;
  const post = getPost(month, day, slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title };
}

export default async function PostPage({ params }: PageProps) {
  const { month, day, slug } = await params;
  const post = getPost(month, day, slug);
  if (!post) notFound();

  return (
    <LegacyPage
      mainHtml={post.mainHtml}
      bodyClass={post.bodyClass}
      cssHash={post.cssHash}
      jsHash={post.jsHash}
    />
  );
}
