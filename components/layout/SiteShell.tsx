import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ShellClientEffects } from "@/components/layout/ShellClientEffects";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <ShellClientEffects />
      <div id="nerio-page" className="nerio-page-wrapper">
        <Header />
        <main id="nerio-content" className="nerio-content-wrapper">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
