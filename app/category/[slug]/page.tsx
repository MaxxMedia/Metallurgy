import { getAllCategories } from "@/lib/categories";
import { createSlugMirrorPage } from "@/lib/content/create-slug-mirror-page";
import { loadCategoryPage } from "@/lib/content/load-mirror-content";

const { Page, generateMetadata, generateStaticParams } = createSlugMirrorPage({
  getAll: getAllCategories,
  load: loadCategoryPage,
});

export { generateMetadata, generateStaticParams };
export default Page;
