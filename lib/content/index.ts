/**
 * Content layer
 *
 * - `data/*.json` — all route + shell markup (run `npm run extract` + `npm run data:build`).
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
