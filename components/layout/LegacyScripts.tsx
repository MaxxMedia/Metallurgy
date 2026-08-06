"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

import type { InlineLegacyScript } from "@/types/site";

type LegacyScriptsProps = {
  jsBundle: string;
  inlineScripts?: InlineLegacyScript[];
};

function isExecutableInlineScript(content: string): boolean {
  const t = content.trim();
  return (
    t.startsWith("var ") ||
    t.startsWith("window.") ||
    t.startsWith("(") ||
    t.startsWith("/*") ||
    t.startsWith("//")
  );
}

function injectInlineScripts(inlineScripts: InlineLegacyScript[]) {
  for (const script of inlineScripts) {
    if (!isExecutableInlineScript(script.content)) continue;
    if (document.getElementById(script.id)) continue;
    const el = document.createElement("script");
    el.id = script.id;
    el.text = script.content;
    document.body.appendChild(el);
  }
}

function loadCombinedBundle(jsBundle: string) {
  if (document.getElementById("nerio-combined-js")) return;
  const el = document.createElement("script");
  el.id = "nerio-combined-js";
  el.src = jsBundle;
  el.async = false;
  document.body.appendChild(el);
}

function hasJquery(): boolean {
  return typeof window !== "undefined" && Boolean((window as Window & { jQuery?: unknown }).jQuery);
}

export function LegacyScripts({ jsBundle, inlineScripts = [] }: LegacyScriptsProps) {
  const booted = useRef(false);

  const bootLegacyJs = useCallback(() => {
    if (booted.current || !hasJquery()) return;
    booted.current = true;
    injectInlineScripts(inlineScripts);
    loadCombinedBundle(jsBundle);
  }, [inlineScripts, jsBundle]);

  useEffect(() => {
    bootLegacyJs();
    if (booted.current) return;
    const timer = window.setInterval(() => {
      bootLegacyJs();
      if (booted.current) window.clearInterval(timer);
    }, 50);
    return () => window.clearInterval(timer);
  }, [bootLegacyJs]);

  return (
    <Script
      id="jquery-core-js"
      src="/wp-includes/js/jquery/jquery.min.js"
      strategy="afterInteractive"
      onLoad={bootLegacyJs}
    />
  );
}
