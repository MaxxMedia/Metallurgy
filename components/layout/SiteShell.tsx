import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Preloader />
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
