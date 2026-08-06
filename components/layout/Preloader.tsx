"use client";

import { useEffect } from "react";

function hidePreloader() {
  const el = document.querySelector<HTMLElement>(".nerio-preloader, #site-preloader");
  if (!el || el.dataset.dismissed === "1") return;
  el.dataset.dismissed = "1";
  el.style.transition = "opacity 300ms ease";
  el.style.opacity = "0";
  window.setTimeout(() => {
    el.style.display = "none";
  }, 320);
}

export function Preloader() {
  useEffect(() => {
    const onLoad = () => hidePreloader();
    if (document.readyState === "complete") {
      window.setTimeout(onLoad, 10);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }
    const fallback = window.setTimeout(onLoad, 6000);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div id="site-preloader" className="nerio-preloader">
      <div className="loader-container">
        <div className="loader-icon">
          <img
            src="/wp-content/themes/nerio/assets/img/preloader.png"
            alt="Technology News Dark"
          />
        </div>
      </div>
    </div>
  );
}
