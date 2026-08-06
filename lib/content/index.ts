/**
 * Content layer
 *
 * - `data/*.json` — structured CMS data (posts, categories, home sections).
 * - content HTML under content/ — Elementor main-column exports (mirror parity).
 * - Home (`/`) — React `HomePageView` (target pattern for other templates).
 * - Other routes — `MirrorMainPage` until each template is rebuilt in React.
 */

export type { MirrorPagePayload, StaticPageSlug } from "@/lib/content/types";
export { getContentRenderMode } from "@/lib/content/render-mode";
export {
  loadAuthorPage,
  loadCategoryPage,
  loadDayArchivePage,
  loadMonthArchivePage,
  loadPostPage,
  loadStaticPage,
  loadTagPage,
  loadYearArchivePage,
} from "@/lib/content/load-mirror-content";
export { mirrorNotFoundMetadata, mirrorPageMetadata } from "@/lib/content/metadata";
export { MirrorPageView, mirrorPageOrNotFound } from "@/lib/content/mirror-page";
export { createStaticMirrorPage } from "@/lib/content/static-mirror-page";
export { createSlugMirrorPage } from "@/lib/content/create-slug-mirror-page";
