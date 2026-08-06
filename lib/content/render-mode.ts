/**
 * Mirror HTML is the default until each template is rebuilt in React (home is first).
 * Set NEXT_PUBLIC_CONTENT_RENDER_MODE=react to opt into React bodies when implemented.
 */
export type ContentRenderMode = "mirror-html" | "react";

export function getContentRenderMode(): ContentRenderMode {
  return process.env.NEXT_PUBLIC_CONTENT_RENDER_MODE === "react"
    ? "react"
    : "mirror-html";
}
