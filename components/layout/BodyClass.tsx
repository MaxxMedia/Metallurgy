"use client";

import { useLayoutEffect } from "react";

/** Always keep dark site shell; theme bodyClass adds page-specific classes. */
const SHELL_BODY =
  "m-0 w-full overflow-x-hidden bg-[#000000] text-[#ffffffe6] antialiased [color-scheme:dark]";

type BodyClassProps = {
  className: string;
};

export function BodyClass({ className }: BodyClassProps) {
  useLayoutEffect(() => {
    document.body.className = `${SHELL_BODY} ${className}`.trim();
    document.documentElement.classList.add("scheme-dark");
    document.documentElement.style.colorScheme = "dark";
  }, [className]);

  return null;
}
