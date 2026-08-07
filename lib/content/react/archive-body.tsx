import { ElementorHtmlBody } from "@/components/content/ElementorHtmlBody";
import { CategoryArchiveView } from "@/components/archive/CategoryArchiveView";
import { CategoryArchivePageView } from "@/components/archive/CategoryArchivePageView";
import { AuthorArchivePageView } from "@/components/archive/AuthorArchivePageView";
import { TagArchiveView } from "@/components/archive/TagArchiveView";
import { AuthorArchiveView } from "@/components/archive/AuthorArchiveView";
import { hasArchiveLayout, getArchiveLayoutKind } from "@/lib/content/archive-html-split";
import type { Author, Category, Post } from "@/types/data";

type ArchiveGridFallback = {
  kind: "category";
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

type TagGridFallback = {
  kind: "tag";
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

type AuthorGridFallback = {
  kind: "author";
  author: Author;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function ArchiveBodyOrGrid(
  props:
    | ({ bodyHtml?: string } & ArchiveGridFallback)
    | ({ bodyHtml?: string } & TagGridFallback)
    | ({ bodyHtml?: string } & AuthorGridFallback),
) {
  if (props.bodyHtml?.trim() && hasArchiveLayout(props.bodyHtml)) {
    const layoutKind = getArchiveLayoutKind(props.bodyHtml);

    if (layoutKind === "author" && props.kind === "author") {
      return (
        <AuthorArchivePageView
          bodyHtml={props.bodyHtml}
          author={props.author}
          posts={props.posts}
          authors={props.authors}
          categories={props.categories}
        />
      );
    }

    if (
      (layoutKind === "category" || layoutKind === "tag") &&
      (props.kind === "category" || props.kind === "tag")
    ) {
      return (
        <CategoryArchivePageView
          bodyHtml={props.bodyHtml}
          title={props.title}
          posts={props.posts}
          authors={props.authors}
          categories={props.categories}
        />
      );
    }
  }

  if (props.bodyHtml?.trim()) {
    return <ElementorHtmlBody html={props.bodyHtml} className="w-full max-w-full" />;
  }

  if (props.kind === "category") {
    return (
      <CategoryArchiveView
        title={props.title}
        posts={props.posts}
        authors={props.authors}
        categories={props.categories}
      />
    );
  }

  if (props.kind === "tag") {
    return (
      <TagArchiveView
        title={props.title}
        posts={props.posts}
        authors={props.authors}
        categories={props.categories}
      />
    );
  }

  return (
    <AuthorArchiveView
      author={props.author}
      posts={props.posts}
      authors={props.authors}
      categories={props.categories}
    />
  );
}
