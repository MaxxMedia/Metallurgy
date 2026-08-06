import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthors, getCategories, getPosts } from "@/lib/api";
import { PostCard } from "@/components/fpg/PostCard";
import { SectionHeading } from "@/components/fpg/SectionHeading";

export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.name} Archives - METALLURGY` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryPosts = posts.filter(
    (p) =>
      p.categorySlug === slug ||
      p.categoryIds?.includes(category.id),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-2">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
          style={{
            backgroundColor: `${category.color || "#10b981"}25`,
            color: category.color || "#10b981",
            border: `1px solid ${category.color || "#10b981"}40`,
          }}
        >
          Category Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {category.name}
        </h1>
        <p className="text-xs text-slate-400">
          Showing {categoryPosts.length} post{categoryPosts.length === 1 ? "" : "s"} under {category.name}
        </p>
      </div>

      <SectionHeading title={`Articles in ${category.name}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryPosts.map((post) => (
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
