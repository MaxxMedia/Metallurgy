import type { Metadata } from "next";
import { legacyMetaTitle } from "@/lib/html-text";

export function reactPageMetadata(title: string): Metadata {
  return { title: legacyMetaTitle(title) };
}

export function reactNotFoundMetadata(): Metadata {
  return { title: "Not Found" };
}
