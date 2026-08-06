"use client";

import { useEffect } from "react";

/** Mark Elementor lazy containers as loaded (same as legacy theme). */
export function HomeClientEffects() {
  useEffect(() => {
    document
      .querySelectorAll(".e-con.e-parent:not(.e-lazyloaded)")
      .forEach((el) => el.classList.add("e-lazyloaded"));
  }, []);

  return null;
}
