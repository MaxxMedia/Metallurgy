import { EWidget } from "@/components/home/elementor/ElementorCon";

const DECOR = [
  {
    id: "ed663c3",
    src: "/wp-content/uploads/sites/32/2025/11/tech_01-min-768x381.jpg",
    alt: "cta-thumb-01.png",
    className: "elementor-absolute elementor-hidden-mobile",
  },
  {
    id: "d8aaed0",
    src: "/wp-content/themes/nerio/assets/img/quote.svg",
    alt: "newsletter-dot.png",
    className: "elementor-absolute elementor-hidden-mobile",
  },
  {
    id: "453c2b2",
    src: "/wp-content/uploads/sites/32/2025/11/tech_02-min-768x381.jpg",
    alt: "cta-thumb-02.png",
    className: "elementor-absolute",
  },
  {
    id: "28571bb",
    src: "/wp-content/uploads/sites/32/2025/11/tech_03-min-768x381.jpg",
    alt: "cta-thumb-03.png",
    className: "elementor-absolute",
  },
  {
    id: "d30075a",
    src: "/wp-content/uploads/sites/32/2025/11/tech_04-min-768x381.jpg",
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
          <div className="rs-image">
            <img
              decoding="async"
              className="rs-multi-image reverse- blend_unset"
              src={item.src}
              alt={item.alt}
            />
          </div>
        </EWidget>
      ))}
    </>
  );
}
