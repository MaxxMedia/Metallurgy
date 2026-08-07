import Link from "next/link";

const VIEW_ALL_ICON = (
  <span className="button-icon inline-flex [&_svg]:h-3 [&_svg]:w-4 [&_svg]:fill-current">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
  </span>
);

type SectionHeadingProps = {
  title: string;
  viewAllHref?: string;
  level?: "h2" | "h4";
  headingId?: string;
  dividerId?: string;
  buttonId?: string;
  showDivider?: boolean;
  viewAllWithIcon?: boolean;
};

export function SectionHeading({
  title,
  viewAllHref,
  level: Level = "h2",
  headingId = "heading",
  dividerId = "divider",
  buttonId = "view-all",
  showDivider = true,
  viewAllWithIcon = false,
}: SectionHeadingProps) {
  const titleSize =
    Level === "h4"
      ? "text-lg font-semibold md:text-xl"
      : "text-2xl font-semibold";

  if (showDivider) {
    return (
      <div className="flex w-full items-center gap-6">

        {/* Heading */}
        <div
          className={`elementor-element elementor-element-${headingId} elementor-widget elementor-widget-heading shrink-0`}
        >
          <Level
            className={`elementor-heading-title elementor-size-default whitespace-nowrap text-[var(--titleColor,#fff)] ${titleSize}`}
          >
            {title}
          </Level>
        </div>

        {/* Divider */}
        <div className="flex flex-1 items-center">
          {/* Left Diamond */}
          <span className="w-[8px] h-[8px] rotate-45 bg-[#1E88FF] shrink-0" />

          {/* Double Line */}
          <div className="flex-1 mx-4">
            <div className="h-px bg-[#2B2F36]" />
            <div className="mt-[3px] h-px bg-[#2B2F36]" />
          </div>

          {/* Right Diamond */}
          <span className="w-[8px] h-[8px] rotate-45 bg-[#1E88FF] shrink-0" />
        </div>

        {/* View All */}
        {viewAllHref && (
          <div
            className={`elementor-element elementor-element-${buttonId} elementor-widget elementor-widget-fpg-button shrink-0`}
          >
            <Link
              href={viewAllHref}
              className="flex items-center gap-2 text-white font-semibold whitespace-nowrap"
            >
              {viewAllWithIcon && VIEW_ALL_ICON}
              View All
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 flex w-full flex-row flex-nowrap items-center justify-between gap-3">
      <div
        className={`elementor-element elementor-element-${headingId} elementor-widget elementor-widget-heading min-w-0 shrink-0`}
      >
        <Level
          className={`elementor-heading-title elementor-size-default whitespace-nowrap text-[var(--titleColor,#fff)] ${titleSize}`}
        >
          {title}
        </Level>
      </div>
      {viewAllHref ? (
        <div className={`elementor-element elementor-element-${buttonId} shrink-0`}>
          <Link
            className="rs-button inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-[var(--titleColor,#fff)] transition-opacity hover:opacity-80"
            href={viewAllHref}
          >
            {viewAllWithIcon ? VIEW_ALL_ICON : null}
            <span className="button-text">View All</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
