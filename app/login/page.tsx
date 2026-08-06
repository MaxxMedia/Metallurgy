import { createStaticMirrorPage } from "@/lib/content/static-mirror-page";

const { Page, generateMetadata } = createStaticMirrorPage("login");

export { generateMetadata };
export default Page;
