"use client";

import { LegacyHtml } from "@/components/LegacyHtml";
import { useEffect, useState } from "react";

type ClientBodyTailProps = {
  html: string;
};

/** Avoid hydration mismatch for large legacy HTML injected after footer. */
export function ClientBodyTail({ html }: ClientBodyTailProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !html) return null;

  return <LegacyHtml html={html} displayContents />;
}
