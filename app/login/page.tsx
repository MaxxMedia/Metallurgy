import { createStaticReactPage } from "@/lib/content/react/create-static-react-page";

const { Page, generateMetadata } = createStaticReactPage("login");

export { generateMetadata };
export default Page;
