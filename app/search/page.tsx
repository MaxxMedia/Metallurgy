import { createStaticMirrorPage } from "@/lib/content/static-mirror-page";

const { Page, generateMetadata } = createStaticMirrorPage("search");

export { generateMetadata };
export default Page;
