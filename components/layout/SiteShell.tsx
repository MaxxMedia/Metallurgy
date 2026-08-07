import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeaderNavEffects } from "@/components/layout/HeaderNavEffects";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ShellClientEffects } from "@/components/layout/ShellClientEffects";
import { ShellLegacyScripts } from "@/components/layout/ShellLegacyScripts";
import { readInlineLegacyScripts } from "@/lib/extracted-content";
import { getHomePageAssets } from "@/lib/page-assets";

type SiteShellProps = {
  children: React.ReactNode;
};

const shellAssets = getHomePageAssets();
const shellInlineScripts = readInlineLegacyScripts();

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <ShellClientEffects />
      <HeaderNavEffects />
      <ShellLegacyScripts
        jsBundle={shellAssets.jsBundle}
        inlineScripts={shellInlineScripts}
      />
      <div id="nerio-page" className="nerio-page-wrapper w-full max-w-full overflow-x-hidden">
        <Header />
        <main id="nerio-content" className="nerio-content-wrapper w-full max-w-full overflow-x-hidden bg-black">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
