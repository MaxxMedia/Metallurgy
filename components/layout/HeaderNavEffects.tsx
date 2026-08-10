"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  initMegaMenuElementorWidgets,
  initMegaMenuNestedTabs,
  markHeaderElementorLazyLoaded,
  repositionHeaderMegaMenus,
} from "@/lib/header-nav-layout";

const SUB_OPEN = "sub-menu-open";
const SUB_SHOW = "show-sub-menu";

function bindMobileSubMenuToggles(): void {
  document.querySelectorAll(".rstb-header .rstb-nav-menu").forEach((nav) => {
    if (nav.getAttribute("data-nerio-sub-bound") === "1") return;
    nav.setAttribute("data-nerio-sub-bound", "1");

    nav.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const icon = target?.closest(".sub-menu-icon");
      if (!icon || !nav.contains(icon)) return;

      const menuItem = icon.closest(".menu-item");
      if (!menuItem) return;

      const panel = icon.parentElement?.nextElementSibling;
      if (
        !panel ||
        (!panel.classList.contains("sub-menu") &&
          !panel.classList.contains("mega-menu"))
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const panelEl = panel as HTMLElement;
      const isOpen = icon.classList.contains(SUB_OPEN);

      nav
        .querySelectorAll(".sub-menu.show-sub-menu, .mega-menu.show-sub-menu")
        .forEach((open) => {
          if (open !== panel) {
            open.classList.remove(SUB_SHOW);
            (open as HTMLElement).style.display = "";
          }
        });
      nav.querySelectorAll(".sub-menu-icon.sub-menu-open").forEach((other) => {
        if (other !== icon) other.classList.remove(SUB_OPEN);
      });

      if (isOpen) {
        icon.classList.remove(SUB_OPEN);
        panelEl.classList.remove(SUB_SHOW);
        panelEl.style.display = "none";
      } else {
        icon.classList.add(SUB_OPEN);
        panelEl.classList.add(SUB_SHOW);
        panelEl.style.display = "block";
      }
    });
  });
}

function bindMegaMenuHoverInit(): void {
  document
    .querySelectorAll(".rstb-header .menu-item-has-mega-menu")
    .forEach((item) => {
      if (item.getAttribute("data-nerio-mega-hover") === "1") return;
      item.setAttribute("data-nerio-mega-hover", "1");
      item.addEventListener("mouseenter", () => {
        initMegaMenuElementorWidgets(item);
        initMegaMenuNestedTabs(item);
        repositionHeaderMegaMenus();
      });
    });
}

function preventHashJumpOnMegaParents(): void {
  document
    .querySelectorAll(
      ".rstb-header .menu-item-has-mega-menu > .menu-item-link[href='#']",
    )
    .forEach((link) => {
      if (link.getAttribute("data-nerio-hash-guard") === "1") return;
      link.setAttribute("data-nerio-hash-guard", "1");
      link.addEventListener("click", (e) => {
        if (window.matchMedia("(min-width: 1025px)").matches) {
          e.preventDefault();
        }
      });
    });
}

function bindMegaMenuTabClicks(): void {
  const header = document.querySelector(".rstb-header");
  if (!header || header.getAttribute("data-nerio-mega-tabs-delegate") === "1") return;
  header.setAttribute("data-nerio-mega-tabs-delegate", "1");
  header.addEventListener("click", (event) => {
    const btn = (event.target as HTMLElement | null)?.closest(
      ".mega-menu .e-n-tab-title",
    );
    if (!btn || !header.contains(btn)) return;
    const tabsRoot = btn.closest(".e-n-tabs");
    if (!tabsRoot) return;
    event.preventDefault();
    const tabIndex = btn.getAttribute("data-tab-index");
    if (!tabIndex) return;
    tabsRoot
      .querySelectorAll<HTMLButtonElement>(".e-n-tabs-heading .e-n-tab-title")
      .forEach((title) => {
        const on = title.getAttribute("data-tab-index") === tabIndex;
        title.setAttribute("aria-selected", on ? "true" : "false");
        title.tabIndex = on ? 0 : -1;
      });
    tabsRoot
      .querySelectorAll<HTMLElement>(
        ".e-n-tabs-content > [role='tabpanel'], .e-n-tabs-content > .e-con[data-tab-index]",
      )
      .forEach((panel) => {
        panel.classList.toggle(
          "e-active",
          panel.getAttribute("data-tab-index") === tabIndex,
        );
      });
    tabsRoot.classList.add("e-activated");
  });
}

function bindOffcanvasToggles(): void {
  const setOpen = (wrap: Element, open: boolean) => {
    const panel = wrap.querySelector<HTMLElement>(".rstb-offcanvas-panel");
    const toggle = wrap.querySelector<HTMLElement>(".offcanvas-toggle");

    if (!panel || !toggle) return;

    panel.classList.toggle("show-offcanvas", open);
    toggle.classList.toggle("panel-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  };

  document.querySelectorAll(".rstb-offcanvas-wrap").forEach((wrap) => {
    const panel = wrap.querySelector<HTMLElement>(".rstb-offcanvas-panel");
    const toggle = wrap.querySelector<HTMLElement>(".offcanvas-toggle");

    if (!panel || !toggle) return;

    toggle.setAttribute("type", "button");
    toggle.setAttribute(
      "aria-expanded",
      panel.classList.contains("show-offcanvas") ? "true" : "false",
    );
    panel.setAttribute(
      "aria-hidden",
      panel.classList.contains("show-offcanvas") ? "false" : "true",
    );
  });

  if (document.body.getAttribute("data-nerio-offcanvas-delegate") !== "1") {
    document.body.setAttribute("data-nerio-offcanvas-delegate", "1");

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const toggle = target.closest(".rstb-offcanvas-wrap .offcanvas-toggle");
      if (toggle) {
        event.preventDefault();
        const wrap = toggle.closest(".rstb-offcanvas-wrap");
        if (!wrap) return;
        const panel = wrap.querySelector(".rstb-offcanvas-panel");
        setOpen(wrap, !panel?.classList.contains("show-offcanvas"));
        return;
      }

      const close = target.closest(
        ".rstb-offcanvas-wrap .offcanvas-close, .rstb-offcanvas-wrap .offcanvas-overly",
      );
      if (close) {
        event.preventDefault();
        const wrap = close.closest(".rstb-offcanvas-wrap");
        if (!wrap) return;
        setOpen(wrap, false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document
        .querySelectorAll(".rstb-offcanvas-wrap .rstb-offcanvas-panel.show-offcanvas")
        .forEach((panel) => {
          const wrap = panel.closest(".rstb-offcanvas-wrap");
          if (wrap) setOpen(wrap, false);
        });
    });
  }
}

function syncHeaderNavLayout(): void {
  markHeaderElementorLazyLoaded();
  repositionHeaderMegaMenus();
  initMegaMenuNestedTabs();
  bindMegaMenuTabClicks();
  bindMobileSubMenuToggles();
  bindOffcanvasToggles();
  bindMegaMenuHoverInit();
  preventHashJumpOnMegaParents();
}

export function HeaderNavEffects() {
  const pathname = usePathname();

  useEffect(() => {
    syncHeaderNavLayout();

    const onResize = () => repositionHeaderMegaMenus();
    window.addEventListener("resize", onResize);

    const t1 = window.setTimeout(syncHeaderNavLayout, 100);
    const t2 = window.setTimeout(syncHeaderNavLayout, 600);
    const t3 = window.setTimeout(repositionHeaderMegaMenus, 1500);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname]);

  return null;
}
