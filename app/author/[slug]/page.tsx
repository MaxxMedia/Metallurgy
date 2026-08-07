import { createAuthorReactPage } from "@/lib/content/react/create-slug-react-page";

const { Page, generateMetadata, generateStaticParams } = createAuthorReactPage();

export { generateMetadata, generateStaticParams };
export default Page;
