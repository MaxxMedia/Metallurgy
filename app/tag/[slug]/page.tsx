import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthors, getCategories, getPosts, getTags } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return { title: "Tag Not Found" };
  return { title: `#${tag.name} - METALLURGY` };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, authors, categories, tags] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
    getTags(),
  ]);

  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const tagPosts = posts.filter((p) => p.tagIds?.includes(tag.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          Tag Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          #{tag.name}
        </h1>
        <p className="text-xs text-slate-400">
          Showing {tagPosts.length} article{tagPosts.length === 1 ? "" : "s"} tagged with #{tag.name}
        </p>
      </div>

      <SectionHeading title={`Articles tagged #${tag.name}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tagPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authors={authors}
            categories={categories}
            variant="three"
            showExcerpt
          />
        ))}
      </div>
    </div>
  );
}
