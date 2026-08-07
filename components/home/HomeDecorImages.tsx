import { EWidget } from "@/components/home/elementor/ElementorCon";

/** Live demo (`sites/5/2026/02`) — tilted UI mockups, not `tech_*` JPGs. */
const CTA_UPLOADS = "/wp-content/uploads/sites/5/2026/02";

const DECOR = [
  {
    id: "ed663c3",
    src: `${CTA_UPLOADS}/cta-thumb-01.png`,
    alt: "cta-thumb-01.png",
    className: "elementor-absolute elementor-hidden-mobile",
  },
  {
    id: "d8aaed0",
    src: `${CTA_UPLOADS}/newsletter-dot.png`,
    alt: "newsletter-dot.png",
    className: "elementor-absolute elementor-hidden-mobile",
  },
  {
    id: "453c2b2",
    src: `${CTA_UPLOADS}/cta-thumb-02.png`,
    alt: "cta-thumb-02.png",
    className: "elementor-absolute",
  },
  {
    id: "28571bb",
    src: `${CTA_UPLOADS}/cta-thumb-03.png`,
    alt: "cta-thumb-03.png",
    className: "elementor-absolute",
  },
  {
    id: "d30075a",
    src: `${CTA_UPLOADS}/cta-thumb-04.png`,
    alt: "cta-thumb-04.png",
    className: "elementor-absolute",
  },
] as const;

export function HomeDecorImages() {
  return (
    <>
      {DECOR.map((item) => (
        <EWidget
          key={item.id}
          id={item.id}
          widgetType="fpg-image"
          className={item.className}
          dataSettings={{ _position: "absolute" }}
        >
          <div className="rs-image ">
            <img
              decoding="async"
              className="rs-multi-image  reverse- blend_unset"
              src={item.src}
              alt={item.alt}
            />
          </div>
        </EWidget>
      ))}
    </>
  );
}
