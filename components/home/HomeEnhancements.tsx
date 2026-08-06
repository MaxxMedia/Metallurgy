"use client";

import { useEffect, useLayoutEffect } from "react";

type HomeEnhancementsProps = {
  perClick?: number;
};

export function HomeEnhancements({ perClick = 3 }: HomeEnhancementsProps) {
  useLayoutEffect(() => {
    document
      .querySelectorAll(".e-con.e-parent:not(.e-lazyloaded)")
      .forEach((el) => {
        el.classList.add("e-lazyloaded");
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let elementorBooted = false;

    const bootElementor = () => {
      if (cancelled || elementorBooted) return;
      const w = window as Window & {
        jQuery?: { (sel: unknown): { trigger: (e: string) => void } };
        elementorFrontend?: { init?: () => void };
      };
      if (!w.jQuery || !w.elementorFrontend?.init) return;
      elementorBooted = true;
      try {
        w.elementorFrontend.init();
      } catch {
        elementorBooted = false;
      }
      w.jQuery(window).trigger("load");
    };

    const timer = window.setInterval(bootElementor, 250);
    window.setTimeout(() => window.clearInterval(timer), 12_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      ".fpg-loadmore-btn",
    );

    const cleanups: (() => void)[] = [];

    buttons.forEach((button) => {
      const grid = button
        .closest(".fpg-post-parent")
        ?.querySelector<HTMLElement>(".fpg-post-grid.fpg-ajax");
      const wrapper = button.closest(".fpg-loadmore-wrapper");
      const doneText = wrapper?.querySelector<HTMLElement>(
        ".fpg-load-complete-text",
      );
      if (!grid || !wrapper) return;

      let offset = 0;
      let loading = false;

      const onClick = async () => {
        if (loading) return;
        loading = true;
        button.disabled = true;

        try {
          const res = await fetch(
            `/api/home/load-more?offset=${offset}&limit=${perClick}`,
          );
          if (!res.ok) throw new Error("load-more failed");
          const data = (await res.json()) as {
            html: string;
            hasMore: boolean;
          };

          if (data.html) {
            grid.insertAdjacentHTML("beforeend", data.html);
            offset += perClick;
          }

          if (!data.hasMore) {
            button.style.display = "none";
            if (doneText) doneText.style.display = "";
          }
        } catch {
          button.disabled = false;
        } finally {
          loading = false;
          if (button.style.display !== "none") button.disabled = false;
        }
      };

      button.addEventListener("click", onClick);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [perClick]);

  return null;
}
