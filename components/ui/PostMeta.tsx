import Link from "next/link";
import type { Author } from "@/types/data";

type PostMetaProps = {
  author: Author;
  views?: number;
  dateISO?: string;
  showDate?: boolean;
  onDark?: boolean;
};

export function PostMeta({
  author,
  views = 40,
  dateISO,
  showDate = false,
  onDark = false,
}: PostMetaProps) {
  const muted = onDark ? "text-white/75" : "text-[var(--bodyColor)]";
  const link = onDark
    ? "text-white/90 hover:text-[var(--primaryColor)]"
    : "hover:text-[var(--primaryColor)]";

  return (
    <ul className={`fpg-post-meta mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${muted}`}>
      <li>
        <span className="fpg-meta">
          By{" "}
          <Link href={author.url} className={`fpg-author-link ${link}`}>
            {author.name}
          </Link>
        </span>
      </li>
      <li>
        <span className="fpg-meta inline-flex items-center gap-1">
          <i className="ri-pulse-fill" /> {views} Views
        </span>
      </li>
      {showDate && dateISO ? (
        <li className="w-full sm:w-auto">
          <span className="fpg-meta inline-flex items-center gap-1">
            <i className="ri-calendar-line" />{" "}
            {new Date(dateISO).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </li>
      ) : null}
    </ul>
  );
}
