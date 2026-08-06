import { SectionHeading } from "@/components/fpg/SectionHeading";

type StaticPageViewProps = {
  title: string;
  description?: string;
};

export function StaticPageView({ title, description }: StaticPageViewProps) {
  return (
    <div className="elementor elementor-page">
      <SectionHeading title={title} level="h2" />
      {description ? (
        <div className="entry-content fpg-post-content">
          <p>{description}</p>
        </div>
      ) : null}
    </div>
  );
}
