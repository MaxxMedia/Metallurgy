import { createDayArchiveReactPage } from "@/lib/content/react/create-date-archive-page";

const { Page, generateMetadata, generateStaticParams } = createDayArchiveReactPage();

export { generateMetadata, generateStaticParams };
export default Page;
