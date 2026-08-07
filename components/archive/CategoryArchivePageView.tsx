import type { Author, Category, Post } from "@/types/data";
import { LegacyHtml } from "@/components/LegacyHtml";
import { CategoryArchiveView } from "@/components/archive/CategoryArchiveView";
import {
  extractArchivePageTitleHtml,
  extractArchiveSidebarHtml,

  getArchiveLayoutKind,
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

  const layoutKind = getArchiveLayoutKind(bodyHtml) ?? "category";

  const shell =
    layoutKind === "tag"
      ? {
          postId: "6577",
          parentId: "fb0bb30",
          mainColumnId: "fc07399",
          gridInnerId: "aecbbf5",
          gridWidgetId: "effbd57",
        }
      : {
          postId: "6802",
          parentId: "e15c990",
          mainColumnId: "329a25d",
          gridInnerId: "cea81db",
          gridWidgetId: "edec4b6",
        };

  return (
    <div className="w-full max-w-full text-[var(--titleColor)]">
      {pageTitleHtml ? <LegacyHtml html={pageTitleHtml} className="w-full" /> : null}

      <div className="rstb-archive-page w-full max-w-full">
        <div
          data-elementor-type="wp-post"

          data-elementor-id={shell.postId}
          className={`elementor elementor-${shell.postId} w-full max-w-full`}
        >
          <ElementorParent
            id={shell.parentId}
            className="e-con-boxed e-flex e-con w-full bg-transparent"
            dataSettings={{ background_background: "classic" }}
          >
            <ElementorInner className="mx-auto w-full max-w-[1410px] px-4 sm:px-6 xl:px-10">
              <ElementorChild
                id={shell.mainColumnId}
                className="e-con-full e-flex min-w-0 w-full flex-1 flex-col"
              >
                <ElementorChild
                  id={shell.gridInnerId}
                  className="e-con-full e-flex min-w-0 flex-1 flex-col"
                >
                  <CategoryArchiveView
                    title={title}
                    posts={posts}
                    authors={authors}
                    categories={categories}
                    showSectionHeading={false}
                    elementorPostGrid={{ widgetId: shell.gridWidgetId }}
                  />
                </ElementorChild>

                {sidebarHtml ? (
                  <LegacyHtml html={sidebarHtml} className="w-full" displayContents />
                ) : null}
              </ElementorChild>
            </ElementorInner>
          </ElementorParent>
        </div>
      </div>
    </div>
  );
}
