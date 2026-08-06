import { getAllTags } from "@/lib/tags";
import { createSlugMirrorPage } from "@/lib/content/create-slug-mirror-page";
import { loadTagPage } from "@/lib/content/load-mirror-content";

const { Page, generateMetadata, generateStaticParams } = createSlugMirrorPage({
  getAll: getAllTags,
  load: loadTagPage,
});

export { generateMetadata, generateStaticParams };
export default Page;
