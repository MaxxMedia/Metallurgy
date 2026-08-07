import { createStaticReactPage } from "@/lib/content/react/create-static-react-page";

const { Page, generateMetadata } = createStaticReactPage("search");

export { generateMetadata };
export default Page;
