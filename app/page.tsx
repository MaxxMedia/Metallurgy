import type { Metadata } from "next";
import { LegacyPage } from "@/components/layout/LegacyPage";
import { ClientBodyTail } from "@/components/home/ClientBodyTail";
import { HomeEnhancements } from "@/components/home/HomeEnhancements";
import { readExtractedHtml, readInlineLegacyScripts } from "@/lib/extracted-content";
import { getHomePageAssets } from "@/lib/page-assets";
import { loadHomeFile, loadSettingsFile } from "@/lib/data-store";

const assets = getHomePageAssets();
const settings = loadSettingsFile();
const homeConfig = loadHomeFile();

export const metadata: Metadata = {
  title: settings.siteName,
};

export default function HomePage() {
  const mainHtml = readExtractedHtml("home-main");
  const bodyTailHtml = readExtractedHtml("body-tail");
  const inlineScripts = readInlineLegacyScripts();

  return (
    <>
      <LegacyPage
        mainHtml={mainHtml}
        bodyClass={assets.bodyClass}
        cssHash={assets.cssHash}
        jsHash={assets.jsHash}
        inlineScripts={inlineScripts}
      />
      <ClientBodyTail html={bodyTailHtml} />
      <HomeEnhancements perClick={homeConfig.loadMore.perClick} />
    </>
  );
}
