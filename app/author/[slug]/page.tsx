import { getAllAuthors } from "@/lib/authors";
import { createSlugMirrorPage } from "@/lib/content/create-slug-mirror-page";
import { loadAuthorPage } from "@/lib/content/load-mirror-content";

const { Page, generateMetadata, generateStaticParams } = createSlugMirrorPage({
  getAll: getAllAuthors,
  load: loadAuthorPage,
});

export { generateMetadata, generateStaticParams };
export default Page;
