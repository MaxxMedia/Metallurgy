"use client";

import { useLayoutEffect } from "react";

type BodyClassProps = {
  className: string;
};

export function BodyClass({ className }: BodyClassProps) {
  useLayoutEffect(() => {
    document.body.className = className;
  }, [className]);

  return null;
}
