import type { Author, Category, Post } from "@/types/data";
import { LegacyHtml } from "@/components/LegacyHtml";
import { AuthorArchiveView } from "@/components/archive/AuthorArchiveView";
import {
  extractArchivePageTitleHtml,
  extractArchiveSidebarHtml,
  extractAuthorInfoHtml,
} from "@/lib/content/archive-html-split";
import {
  ElementorChild,
  ElementorInner,
  ElementorParent,
} from "@/components/ui/ElementorLayout";

type AuthorArchivePageViewProps = {
  bodyHtml: string;
  author: Author;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function AuthorArchivePageView({
  bodyHtml,
  author,
  posts,
  authors,
  categories,
}: AuthorArchivePageViewProps) {
  const pageTitleHtml = extractArchivePageTitleHtml(bodyHtml);
  const sidebarHtml = extractArchiveSidebarHtml(bodyHtml);
  const authorInfoHtml = extractAuthorInfoHtml(bodyHtml);

  return (
    <div className="w-full max-w-full text-[var(--titleColor)]">
      {pageTitleHtml ? <LegacyHtml html={pageTitleHtml} className="w-full" /> : null}

      <div className="rstb-archive-page w-full max-w-full">
        <div
          data-elementor-type="wp-post"
          data-elementor-id="6578"
          className="elementor elementor-6578 w-full max-w-full"
        >
          <ElementorParent
            id="84f85da"
            className="e-con-boxed e-flex e-con w-full bg-transparent"
            dataSettings={{ background_background: "classic" }}
          >
            <ElementorInner className="mx-auto flex w-full max-w-[1410px] flex-wrap items-start gap-8 px-4 sm:px-6 lg:flex-nowrap xl:px-10">
              <ElementorChild id="d864673" className="e-con-full e-flex min-w-0 flex-1 flex-col">
                <ElementorChild id="a3ddd3f" className="e-con-full e-flex w-full flex-col">
                  {authorInfoHtml ? (
                    <LegacyHtml html={authorInfoHtml} className="w-full" displayContents />
                  ) : null}
                  <AuthorArchiveView
                    author={author}
                    posts={posts}
                    authors={authors}
                    categories={categories}
                    showSectionHeading={false}
                    elementorPostGrid
                  />
                </ElementorChild>
              </ElementorChild>

              {sidebarHtml ? (
                <div className="w-full shrink-0 lg:max-w-[360px]">
                  <LegacyHtml html={sidebarHtml} className="w-full" displayContents />
                </div>
              ) : null}
            </ElementorInner>
          </ElementorParent>
        </div>
      </div>
    </div>
  );
}
