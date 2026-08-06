"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    const btn = document.getElementById("rs-scroll-to-top");
    if (!btn) return;

    const onScroll = () => {
      const show = window.scrollY > 150;
      btn.style.display = show ? "flex" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onClick = (e: Event) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    btn.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      btn.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      id="rs-scroll-to-top"
      data-max="113.1"
      data-unit="px"
      data-reverse="true"
      style={{ display: "none" }}
    >
      <svg className="arrowup" viewBox="0 0 24 24" width="18" height="18">
        <path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z" />
      </svg>
    </div>
  );
}
