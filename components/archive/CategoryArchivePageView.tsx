import type { Author, Category, Post } from "@/types/data";
import { LegacyHtml } from "@/components/LegacyHtml";
import { CategoryArchiveView } from "@/components/archive/CategoryArchiveView";
import {
  extractArchivePageTitleHtml,
  extractArchiveSidebarHtml,
} from "@/lib/content/archive-html-split";
import {
  ElementorChild,
  ElementorInner,
  ElementorParent,
} from "@/components/ui/ElementorLayout";

type CategoryArchivePageViewProps = {
  bodyHtml: string;
  title: string;
  posts: Post[];
  authors: Author[];
  categories: Category[];
};

export function CategoryArchivePageView({
  bodyHtml,
  title,
  posts,
  authors,
  categories,
}: CategoryArchivePageViewProps) {
  const pageTitleHtml = extractArchivePageTitleHtml(bodyHtml);
  const sidebarHtml = extractArchiveSidebarHtml(bodyHtml);

  return (
    <div className="w-full max-w-full text-[var(--titleColor)]">
      {pageTitleHtml ? <LegacyHtml html={pageTitleHtml} className="w-full" /> : null}

      <div className="rstb-archive-page w-full max-w-full">
        <div
          data-elementor-type="wp-post"
          data-elementor-id="6802"
          className="elementor elementor-6802 w-full max-w-full"
        >
          <ElementorParent id="e15c990" className="e-con-boxed e-flex w-full bg-transparent py-6">
            <ElementorInner className="mx-auto flex w-full max-w-[1410px] flex-wrap items-start gap-8 px-4 sm:px-6 lg:flex-nowrap xl:px-10">
              <ElementorChild id="329a25d" className="e-con-full e-flex min-w-0 flex-1 flex-col">
                <CategoryArchiveView
                  title={title}
                  posts={posts}
                  authors={authors}
                  categories={categories}
                  showSectionHeading={false}
                />
              </ElementorChild>

              {sidebarHtml ? (
                <LegacyHtml
                  html={sidebarHtml}
                  className="elementor-element e-con e-child e-con-full e-flex w-full shrink-0 flex-col lg:max-w-[360px]"
                />
              ) : null}
            </ElementorInner>
          </ElementorParent>
        </div>
      </div>
    </div>
  );
}
