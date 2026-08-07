import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
  color: string;
};

export function CategoryBadge({ name, slug, color }: CategoryBadgeProps) {
  return (
    <div className="fpg-post-cat flex flex-wrap items-center gap-1">
      <Link
        href={`/category/${slug}`}
        className="post-cat inline-flex rounded-[0_100px_100px_70px] px-2.5 pb-0 pt-px text-xs font-medium uppercase text-white"
        style={
          {
            "--catCurrentBgColor": color,
            "--catCurrentColor": "#ffffff",
          } as React.CSSProperties
        }
      >
        {name}
      </Link>
    </div>
  );
}
