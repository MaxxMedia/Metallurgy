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

  initMegaMenuNestedTabs(mega);

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

function megaMenuTabRoots(root: ParentNode): Element[] {
  if (root instanceof Element) {
    if (root.classList.contains("e-n-tabs")) return [root];
    if (root.classList.contains("mega-menu")) {
      return [...root.querySelectorAll(".e-n-tabs")];
    }
    return [...root.querySelectorAll(".mega-menu .e-n-tabs")];
  }
  return [...root.querySelectorAll(".rstb-header .mega-menu .e-n-tabs")];
}

/** Elementor nested tabs in mega menus (Features / Technology) — manual fallback when frontend JS is late. */
export function initMegaMenuNestedTabs(root: ParentNode = document): void {
  megaMenuTabRoots(root).forEach((tabsRoot) => {
    if (tabsRoot.getAttribute("data-nerio-n-tabs-bound") === "1") return;
    tabsRoot.setAttribute("data-nerio-n-tabs-bound", "1");
    tabsRoot.classList.add("e-activated");
    tabsRoot.setAttribute("data-touch-mode", "false");

    const titles = tabsRoot.querySelectorAll<HTMLButtonElement>(
      ".e-n-tabs-heading .e-n-tab-title",
    );
    const panels = tabsRoot.querySelectorAll<HTMLElement>(
      ".e-n-tabs-content > [role='tabpanel'], .e-n-tabs-content > .e-con[data-tab-index]",
    );

    const activate = (tabIndex: string) => {
      titles.forEach((btn) => {
        const on = btn.getAttribute("data-tab-index") === tabIndex;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel) => {
        const on = panel.getAttribute("data-tab-index") === tabIndex;
        panel.classList.toggle("e-active", on);
      });
    };

    titles.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        const tabIndex = btn.getAttribute("data-tab-index");
        if (tabIndex) activate(tabIndex);
      });
    });

    const selected =
      tabsRoot.querySelector<HTMLButtonElement>(".e-n-tab-title[aria-selected='true']") ??
      titles[0];
    const initialIndex = selected?.getAttribute("data-tab-index") ?? "1";
    activate(initialIndex);
  });
}
