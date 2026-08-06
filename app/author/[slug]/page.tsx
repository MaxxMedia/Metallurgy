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
  const authors = await getAuthors();
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const authors = await getAuthors();
  const author = authors.find((a) => a.slug === slug);
  if (!author) return { title: "Author Not Found" };
  return { title: `Articles by ${author.name} - METALLURGY` };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, authors, categories] = await Promise.all([
    getPosts(),
    getAuthors(),
    getCategories(),
  ]);

  const author = authors.find((a) => a.slug === slug);
  if (!author) notFound();

  const authorPosts = posts.filter((p) => p.authorId === author.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg flex-shrink-0">
          {author.name.charAt(0)}
        </div>
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Author Profile
          </span>
          <h1 className="text-3xl font-extrabold text-white">{author.name}</h1>
          <p className="text-xs text-slate-400">
            Staff writer &amp; investigative technology reporter. {authorPosts.length} published article{authorPosts.length === 1 ? "" : "s"}.
          </p>
        </div>
      </div>

      <SectionHeading title={`Articles by ${author.name}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorPosts.map((post) => (
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
