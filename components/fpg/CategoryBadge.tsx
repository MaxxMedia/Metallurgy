import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
  color?: string;
};

export function CategoryBadge({ name, slug, color }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all duration-200 shadow-sm"
      style={{
        backgroundColor: color ? `${color}25` : "#10b98125",
        color: color || "#10b981",
        border: `1px solid ${color ? `${color}40` : "#10b98140"}`,
      }}
    >
      {name}
    </Link>
  );
}
