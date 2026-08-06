import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostArticleView } from "@/components/post/PostArticleView";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ month: string; day: string; slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} - METALLURGY` };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const author = authors.find((a) => a.id === post.authorId) || authors[0] || {
    id: 1,
    name: "Editorial Staff",
    slug: "editorial",
    url: "/author/istiak",
  };

  const category = categories.find((c) => post.categoryIds?.includes(c.id));

  return (
    <PostArticleView post={post} author={author} category={category} />
  );
}
