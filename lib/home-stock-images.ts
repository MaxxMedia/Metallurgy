/** Stock upload paths from the Technology News Dark home mirror (always materialized under public/). */

export const STOCK_MEDIUM = [
  "/wp-content/uploads/sites/32/2025/11/tech_01-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_02-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_03-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_04-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/11/tech_09-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_13-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_15-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_17-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/tech_18-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/post_54-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/post_57-min-768x381.jpg",
  "/wp-content/uploads/sites/32/2025/10/post_13-min-768x381.jpg",
] as const;

export const DEFAULT_MEDIUM = STOCK_MEDIUM[2];

/** Home layout: match mirror featured image URLs for key blocks. */
export const HOME_POST_DISPLAY: Partial<
  Record<number, { thumb: string; medium: string; large: string }>
> = {
  2168: {
    medium: DEFAULT_MEDIUM,
    large: DEFAULT_MEDIUM,
    thumb: "/wp-content/uploads/sites/32/2025/11/tech_03-min-150x150.jpg",
  },
  2217: {
    thumb: "/wp-content/uploads/sites/32/2025/10/tech_13-min-150x150.jpg",
    medium: "/wp-content/uploads/sites/32/2025/10/tech_13-min-768x381.jpg",
    large: "/wp-content/uploads/sites/32/2025/10/tech_13-min-768x381.jpg",
  },
  5062: {
    thumb: "/wp-content/uploads/sites/32/2025/11/tech_09-min-150x150.jpg",
    medium: "/wp-content/uploads/sites/32/2025/11/tech_09-min-768x381.jpg",
    large: "/wp-content/uploads/sites/32/2025/11/tech_09-min-768x381.jpg",
  },
  5091: {
    medium: "/wp-content/uploads/sites/32/2025/11/tech_03-min-768x381.jpg",
    large: "/wp-content/uploads/sites/32/2025/11/tech_03-min-768x381.jpg",
    thumb: "/wp-content/uploads/sites/32/2025/11/tech_03-min-150x150.jpg",
  },
  1922: {
    thumb: "/wp-content/uploads/sites/32/2025/10/post_54-min-150x150.jpg",
    medium: "/wp-content/uploads/sites/32/2025/10/post_54-min-768x381.jpg",
    large: "/wp-content/uploads/sites/32/2025/10/post_54-min-768x381.jpg",
  },
  1919: {
    thumb: "/wp-content/uploads/sites/32/2025/10/post_46-min-150x150.jpg",
    medium: "/wp-content/uploads/sites/32/2025/10/post_46-min-768x381.jpg",
    large: "/wp-content/uploads/sites/32/2025/10/post_46-min-768x381.jpg",
  },
};

const PLACEHOLDER_STEMS = ["fd_cmin", "fascsty2", "fascsty"];

export function usesPlaceholderFeatured(src: string | undefined): boolean {
  if (!src) return true;
  return PLACEHOLDER_STEMS.some((stem) => src.includes(stem));
}

export function stockImageForPost(
  postId: number,
  size: "thumb" | "medium" | "large",
): string {
  const mapped = HOME_POST_DISPLAY[postId];
  if (mapped?.[size]) return mapped[size]!;

  const medium = STOCK_MEDIUM[Math.abs(postId) % STOCK_MEDIUM.length]!;
  if (size === "medium" || size === "large") return medium;

  const base = medium.replace(/-\d+x\d+(\.[a-z]+)$/i, "$1");
  const ext = base.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] ?? ".jpg";
  const stem = base.replace(ext, "");
  return `${stem}-150x150${ext}`;
}

export function sizedFromMedium(mediumUrl: string, size: "thumb" | "medium" | "large"): string {
  if (
    size === "medium" ||
    mediumUrl.startsWith("http://") ||
    mediumUrl.startsWith("https://") ||
    mediumUrl.startsWith("/uploads/")
  ) {
    return mediumUrl;
  }
  const ext = mediumUrl.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] ?? ".jpg";
  const stem = mediumUrl.replace(ext, "").replace(/-\d+x\d+$/i, "");
  if (size === "thumb") return `${stem}-150x150${ext}`;
  if (mediumUrl.includes("-768x")) return mediumUrl;
  return `${stem}-768x381${ext}`;
}
