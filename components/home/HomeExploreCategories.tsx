import Link from "next/link";
import type { Category } from "@/types/data";
import {
  HOME_EXPLORE_CATEGORY_SLUGS,
  categoryCardImage,
} from "@/lib/category-images";

type HomeExploreCategoriesProps = {
  categories: Category[];
};

export function HomeExploreCategories({ categories }: HomeExploreCategoriesProps) {
  const exploreCategories = HOME_EXPLORE_CATEGORY_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug),
  ).filter((c): c is Category => Boolean(c));

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
      <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
        <i className="ri-folder-open-fill text-emerald-400"></i>
        Explore Categories
      </h3>

      <div className="space-y-2.5">
        {exploreCategories.map((cat) => {
          const image = categoryCardImage(cat.slug, cat.image);
          return (
            <Link
              key={cat.id}
              href={cat.url}
              className="relative group flex items-center justify-between p-3 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-950 transition-all duration-300"
            >
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
              <div className="relative z-10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></span>
                <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </span>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-emerald-400">
                <span>{cat.postCount} articles</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
