import Link from "next/link";
import type { Author } from "@/types/data";

type PostMetaProps = {
  author: Author;
  views?: number;
  dateISO?: string;
  showDate?: boolean;
};

export function PostMeta({
  author,
  views = 40,
  dateISO,
  showDate = false,
}: PostMetaProps) {
  return (
    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 font-medium">
      <div className="flex items-center gap-1">
        <span>By</span>
        <Link
          href={author.url}
          className="text-slate-200 hover:text-emerald-400 font-semibold transition-colors"
        >
          {author.name}
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <i className="ri-pulse-fill text-emerald-400 text-sm"></i>
        <span>{views} views</span>
      </div>

      {showDate && dateISO ? (
        <div className="flex items-center gap-1">
          <i className="ri-calendar-line text-slate-500 text-sm"></i>
          <span>
            {new Date(dateISO).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      ) : null}
    </div>
  );
}
