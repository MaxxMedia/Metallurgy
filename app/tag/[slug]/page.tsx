import { createTagReactPage } from "@/lib/content/react/create-slug-react-page";

const { Page, generateMetadata, generateStaticParams } = createTagReactPage();

export { generateMetadata, generateStaticParams };
export default Page;
