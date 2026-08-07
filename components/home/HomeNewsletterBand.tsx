import { EChild, EInner, EParent } from "@/components/home/elementor/ElementorCon";
import { HomeDecorImages } from "@/components/home/HomeDecorImages";
import { HomeNewsletterForm } from "@/components/home/HomeNewsletterForm";

/** Classic background image on `db9a700` (not a CSS gradient — `nerio_adds-1.jpg`). */
export const NEWSLETTER_PANEL_BG =
  "/wp-content/uploads/sites/32/2025/11/nerio_adds-1.jpg";

/** Full-width newsletter block (`f12b084`) — DOM matches live demo `ef71355` → `db9a700`. */
export function HomeNewsletterBand() {
  return (
    <EParent
      id="f12b084"
      className="e-flex e-con-boxed e-lazyloaded"
      dataSettings={{ background_background: "classic" }}
    >
      <EInner>
        <EChild id="ef71355" className="e-con-full e-flex">
          <EChild
            id="db9a700"
            className="e-con-full e-flex e-lazyloaded relative overflow-hidden"
            dataSettings={{ background_background: "classic" }}
            style={{
              backgroundImage: `url(${NEWSLETTER_PANEL_BG})`,
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <EChild id="ac8d978" className="e-con-full e-flex">
              <HomeNewsletterForm />
            </EChild>
            <HomeDecorImages />
          </EChild>
        </EChild>
      </EInner>
    </EParent>
  );
}
