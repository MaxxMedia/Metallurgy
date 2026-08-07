import { SectionHeading } from "@/components/fpg/SectionHeading";

type StaticPageViewProps = {
  title: string;
  description?: string;
  bodyHtml?: string;
};

export function StaticPageView({ title, description, bodyHtml }: StaticPageViewProps) {
  return (
    <div className="elementor elementor-page w-full">
      <SectionHeading title={title} level="h2" showDivider={false} />
      {bodyHtml ? (
        <div
          className="entry-content fpg-post-content prose prose-neutral max-w-none text-[var(--bodyColor)] [&_a]:text-[var(--primaryColor)]"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : description ? (
        <div className="entry-content fpg-post-content text-base leading-relaxed text-[var(--bodyColor)]">
          <p>{description}</p>
        </div>
      ) : null}
    </div>
  );
}
