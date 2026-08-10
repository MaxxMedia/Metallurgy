import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ElementorHtmlBody } from "@/components/content/ElementorHtmlBody";
import { ContentThemeLayout } from "@/components/layout/ContentThemeLayout";
import { PostArticleView } from "@/components/post/PostArticleView";
import {
  getPostBySlug,
  getAuthorBySlug,
  getAuthors,
  getCategoryBySlug,
} from "@/lib/api";
import { reactNotFoundMetadata, reactPageMetadata } from "@/lib/content/react/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const SINGLE_BODY =
  "wp-singular post-template-default single single-post single-format-standard wp-theme-nerio scheme-light elementor-default elementor-kit-4659";

function isElementorPostBody(html?: string) {
  return Boolean(
    html?.includes("data-elementor") || html?.includes("rstb-single-page"),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return reactNotFoundMetadata();
  return reactPageMetadata(post.title);
}

export default async function PostDetailBySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const author =
    (await getAuthors()).find((a) => a.id === post.authorId) ??
    (await getAuthorBySlug("istiak")) ??
    (await getAuthors())[0];

  const category = post.categorySlug
    ? await getCategoryBySlug(post.categorySlug)
    : undefined;

  const useElementor = isElementorPostBody(post.bodyHtml);

  return (
    <ContentThemeLayout
      bodyClass={post.bodyClass ?? SINGLE_BODY}
      cssHash={post.cssHash}
      jsHash={post.jsHash}
    >
      {useElementor && post.bodyHtml ? (
        <ElementorHtmlBody html={post.bodyHtml} />
      ) : (
        <PostArticleView post={post} author={author!} category={category} />
      )}
    </ContentThemeLayout>
  );
}
