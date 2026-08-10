"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import HamburgerMenu from "@/components/layout/Hamburgermenu";

export function HeaderWithHamburger() {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const mountId = useMemo(
    () => `nerio-custom-hamburger-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );

  useEffect(() => {
    let observer: MutationObserver | null = null;

    const ensureMount = () => {
      const signUp = document.querySelector<HTMLAnchorElement>('a[href="/register"]');
      if (!signUp) return false;
      const signUpWidget =
        signUp.closest<HTMLElement>(".elementor-widget") ?? signUp.parentElement;
      if (!signUpWidget) return false;

      const existingHamburger =
        document.querySelector<HTMLElement>(".menu-toggler-wrap") ||
        document.querySelector<HTMLElement>(".offcanvas-toggle-wrap") ||
        document.querySelector<HTMLElement>(".rstb-offcanvas-wrap");

      if (existingHamburger) {
        existingHamburger.style.display = "none";
      }

      let mount = document.getElementById(mountId);
      if (!mount) {
        mount = document.createElement("div");
        mount.id = mountId;
      }

      mount.style.display = "inline-flex";
      mount.style.marginLeft = "10px";
      mount.style.verticalAlign = "middle";
      mount.style.alignSelf = "center";

      if (signUpWidget.nextElementSibling !== mount) {
        signUpWidget.insertAdjacentElement("afterend", mount);
      }

      setMountNode(mount);
      return true;
    };

    const timer = window.setTimeout(() => {
      ensureMount();
    }, 100);

    observer = new MutationObserver(() => {
      ensureMount();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      const mount = document.getElementById(mountId);
      mount?.remove();
    };
  }, [mountId]);

  if (!mountNode) return null;

  return createPortal(<HamburgerMenu />, mountNode);
}
