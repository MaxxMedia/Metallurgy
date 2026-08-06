/** Mirrors Nerio theme mega-menu width/offset logic (see combined JS `l()`). */
export function repositionHeaderMegaMenus(root: ParentNode = document): void {
  const bodyWidth = document.body.clientWidth;

  root.querySelectorAll(".rstb-header .rstb-nav-menu").forEach((nav) => {
    if (nav.classList.contains("nav-vertical")) return;

    nav.querySelectorAll(".primary-menu .mega-menu").forEach((mega) => {
      const el = mega as HTMLElement;
      const menuItem = el.closest(".menu-item");
      if (!menuItem) return;
      if (menuItem.closest(".sub-menu")) return;

      const isFull =
        el.classList.contains("mega-menu-width-full") ||
        el.classList.contains("mega-menu-width-container");
      if (!isFull) return;

      const rect = menuItem.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      el.style.left = `${-left}px`;
      el.style.width = `${bodyWidth}px`;
    });

    const classicPanel = nav.querySelector(
      ".mobile-panel-wrapper.panel-classic",
    ) as HTMLElement | null;
    if (classicPanel) {
      const navEl = nav as HTMLElement;
      const rect = navEl.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      classicPanel.style.left = `${-left}px`;
      classicPanel.style.width = `${bodyWidth}px`;
    }
  });
}

export function markHeaderElementorLazyLoaded(root: ParentNode = document): void {
  root.querySelectorAll(".rstb-header .e-con.e-parent").forEach((el) => {
    el.classList.add("e-lazyloaded");
  });
  root.querySelectorAll(".rstb-header .elementor-323, .rstb-header .elementor-4824").forEach(
    (el) => {
      el.classList.add("e-lazyloaded");
    },
  );
}

export function initMegaMenuElementorWidgets(menuItem: Element): void {
  const mega = menuItem.querySelector(".mega-menu");
  if (!mega || mega.getAttribute("data-nerio-mega-init") === "1") return;
  mega.setAttribute("data-nerio-mega-init", "1");

  const w = window as Window & {
    elementorFrontend?: {
      elementsHandler?: { runReadyTrigger: (el: Element) => void };
    };
  };
  if (!w.elementorFrontend?.elementsHandler) return;

  mega.querySelectorAll(".elementor-widget").forEach((widget) => {
    try {
      w.elementorFrontend!.elementsHandler!.runReadyTrigger(widget);
    } catch {
      /* widget may already be initialized */
    }
  });
}
