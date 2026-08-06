import { createStaticMirrorPage } from "@/lib/content/static-mirror-page";

const { Page, generateMetadata } = createStaticMirrorPage("about-us");

export { generateMetadata };
export default Page;
