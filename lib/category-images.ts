/** Category card backgrounds from the home page mirror (Elementor). */
const CATEGORY_IMAGES: Record<string, string> = {
  "tech-2": "/wp-content/uploads/sites/32/2025/11/video-min-768x260.jpg",
  digital: "/wp-content/uploads/sites/32/2025/11/tech_02-min-768x381.jpg",
  innovation: "/wp-content/uploads/sites/32/2025/10/tech_18-min-768x381.jpg",
  software: "/wp-content/uploads/sites/32/2025/10/tech_15-min-768x381.jpg",
  gadget: "/wp-content/uploads/sites/32/2025/11/banner-bg-thumb-01-min-768x474.png",
  automation: "/wp-content/uploads/sites/32/2025/11/tech_01-min-768x381.jpg",
  future: "/wp-content/uploads/sites/32/2025/10/tech_12-min-768x381.jpg",
  robotics: "/wp-content/uploads/sites/32/2025/10/tech_17-min-768x381.jpg",
};

export const HOME_EXPLORE_CATEGORY_SLUGS = [
  "tech-2",
  "digital",
  "innovation",
  "software",
  "gadget",
  "automation",
] as const;

export function categoryCardImage(slug: string, fallback?: string): string {
  return CATEGORY_IMAGES[slug] ?? fallback ?? CATEGORY_IMAGES["tech-2"];
}
