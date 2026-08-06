import type { Metadata } from "next";
import { legacyMetaTitle } from "@/lib/html-text";

export function mirrorPageMetadata(rawTitle: string): Metadata {
  return { title: legacyMetaTitle(rawTitle) };
}

export function mirrorNotFoundMetadata(): Metadata {
  return { title: "Not Found" };
}
