import { EChild, EWidget } from "@/components/home/elementor/ElementorCon";
import { HOME_SIDEBAR_SOCIAL } from "@/lib/home-sidebar-social";

/** Sidebar Follow Us block (`f6aed01` + `be6c624`) — mirror markup. */
export function HomeSidebarFollow() {
  return (
    <EChild
      id="f6aed01"
      className="e-con-full e-flex"
      dataSettings={{ background_background: "classic" }}
    >
      <EWidget id="b9dd492" widgetType="heading" bareContainer>
        <h4 className="elementor-heading-title elementor-size-default">Follow Us</h4>
      </EWidget>
      <EWidget id="be6c624" widgetType="fpg-social-icons">
        <div className="rs-social-menu style1">
          <div className="social-wrapper">
            {HOME_SIDEBAR_SOCIAL.map((item) => (
              <a key={item.repeaterClass} className={item.repeaterClass} href={item.href}>
                <div className="icon-wrapper">{item.icon}</div>
                <span className="text-wrapper">{item.label}</span>
                <div className="sub-text">{item.subText}</div>
              </a>
            ))}
          </div>
        </div>
      </EWidget>
    </EChild>
  );
}
