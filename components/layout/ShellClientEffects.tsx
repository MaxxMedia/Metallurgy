"use client";

import { useEffect } from "react";

/** Elementor lazy backgrounds + header ticker/mega-menu need e-lazyloaded after paint. */
export function ShellClientEffects() {
  useEffect(() => {
    document
      .querySelectorAll(".e-con.e-parent:not(.e-lazyloaded)")
      .forEach((el) => el.classList.add("e-lazyloaded"));

    document
      .querySelectorAll(".elementor-323, .elementor-129, .elementor-4824")
      .forEach((el) => el.classList.add("e-lazyloaded"));
  }, []);

  return null;
}
