"use client";

import { LegacyScripts } from "@/components/layout/LegacyScripts";
import type { InlineLegacyScript } from "@/types/site";

type ShellLegacyScriptsProps = {
  jsBundle: string;
  inlineScripts: InlineLegacyScript[];
};

export function ShellLegacyScripts({
  jsBundle,
  inlineScripts,
}: ShellLegacyScriptsProps) {
  return <LegacyScripts jsBundle={jsBundle} inlineScripts={inlineScripts} />;
}
