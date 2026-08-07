
import { ElementorMirrorPageView } from "@/components/pages/ElementorMirrorPageView";

type StaticPageViewProps = {
  title: string;
  description?: string;
  bodyHtml?: string;
};

export function StaticPageView({ description, bodyHtml }: StaticPageViewProps) {
  if (bodyHtml?.trim()) {
    return <ElementorMirrorPageView bodyHtml={bodyHtml} />;
  }

  if (description) {
    return (
      <div className="entry-content fpg-post-content w-full max-w-full text-base leading-relaxed text-[var(--bodyColor)]">
        <p>{description}</p>
      </div>
    );
  }

  return null;
}
