import { createMonthArchiveReactPage } from "@/lib/content/react/create-date-archive-page";

const { Page, generateMetadata, generateStaticParams } =
  createMonthArchiveReactPage();

export { generateMetadata, generateStaticParams };
export default Page;
