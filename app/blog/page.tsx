import { createStaticMirrorPage } from "@/lib/content/static-mirror-page";

const { Page, generateMetadata } = createStaticMirrorPage("blog");

export { generateMetadata };
export default Page;
