import Link from "next/link";

const VIEW_ALL_ICON = (
  <span className="button-icon">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
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
  return (
    <>
      <div
        className={`elementor-element elementor-element-${headingId} elementor-widget elementor-widget-heading`}
        data-id={headingId}
        data-element_type="widget"
        data-widget_type="heading.default"
      >
        <Level className="elementor-heading-title elementor-size-default">{title}</Level>
      </div>
      {showDivider ? (
        <div
          className={`elementor-element elementor-element-${dividerId} elementor-widget__width-inherit elementor-widget elementor-widget-fpg-divider`}
          data-id={dividerId}
          data-element_type="widget"
          data-widget_type="fpg-divider.default"
        >
          <div className="elementor-widget-container">
            <div className="rs-divider dot-enable">
              <span> </span>
            </div>
          </div>
        </div>
      ) : null}
      {viewAllHref ? (
        <div
          className={`elementor-element elementor-element-${buttonId} elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-fpg-button`}
          data-id={buttonId}
          data-element_type="widget"
          data-widget_type="fpg-button.default"
        >
          <div className="elementor-widget-container">
            <Link
              className="rs-button style-default icon-anim-flip-right text-anim-flip-top"
              href={viewAllHref}
            >
              {viewAllWithIcon ? VIEW_ALL_ICON : null}
              <span className="button-text" data-text="View All">
                View All
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
