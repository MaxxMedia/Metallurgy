import { EChild, EInner, EParent } from "@/components/home/elementor/ElementorCon";
import { HomeDecorImages } from "@/components/home/HomeDecorImages";
import { HomeNewsletterForm } from "@/components/home/HomeNewsletterForm";

/** Full-width newsletter block (`f12b084`) at bottom of home. */
export function HomeNewsletterBand() {
  return (
    <EParent
      id="f12b084"
      className="e-flex e-con-boxed"
      dataSettings={{ background_background: "classic" }}
    >
      <EInner>
        <EChild id="ef71355" className="e-con-full e-flex">
          <EChild
            id="db9a700"
            className="e-con-full e-flex"
            dataSettings={{ background_background: "classic" }}
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
