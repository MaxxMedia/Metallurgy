import { createStaticMirrorPage } from "@/lib/content/static-mirror-page";

const { Page, generateMetadata } = createStaticMirrorPage("contact");

export { generateMetadata };
export default Page;
