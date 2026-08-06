import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import {
  loadPostPage,
  mirrorNotFoundMetadata,
  mirrorPageMetadata,
  MirrorPageView,
  mirrorPageOrNotFound,
} from "@/lib/content";

type PageProps = {
  params: Promise<{ month: string; day: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day, slug } = await params;
  const page = loadPostPage(month, day, slug);
  if (!page) return mirrorNotFoundMetadata();
  return mirrorPageMetadata(page.title);
}

export default async function PostPage({ params }: PageProps) {
  const { month, day, slug } = await params;
  const page = mirrorPageOrNotFound(loadPostPage(month, day, slug));
  return <MirrorPageView page={page} />;
}
