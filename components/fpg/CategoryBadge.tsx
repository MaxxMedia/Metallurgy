import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
  color: string;
};

export function CategoryBadge({ name, slug, color }: CategoryBadgeProps) {
  return (
    <div className="fpg-post-cat">
      <Link
        href={`/category/${slug}`}
        className="post-cat"
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
