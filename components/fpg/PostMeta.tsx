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
    <ul className="fpg-post-meta">
      <li>
        <span className="fpg-meta">
          <span>
            By{" "}
            <Link href={author.url} className="fpg-author-link">
              {author.name}
            </Link>
          </span>
        </span>
      </li>
      <li>
        <span className="fpg-meta">
          <i className="ri-pulse-fill" /> {views} Views
        </span>
      </li>
      {showDate && dateISO ? (
        <li>
          <span className="fpg-meta">
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
