import Link from "next/link";
import type { Post } from "@/types/data";
import type { SiteMenus, SiteSettings } from "@/types/data";

type SiteHeaderProps = {
  settings: SiteSettings;
  menus: SiteMenus;
  tickerPosts: Post[];
  tickerLabel: string;
};

export function SiteHeader({
  settings,
  menus,
  tickerPosts,
  tickerLabel,
}: SiteHeaderProps) {
  const navItems = menus.primary.filter((item) => !item.href.endsWith("/#")).slice(0, 8);

  return (
    <header className="rstb-header">
      <div data-elementor-type="wp-post" data-elementor-id="323" className="elementor elementor-323">
        <div className="elementor-element e-con-full e-flex e-con e-parent">
          <div className="elementor-element e-con-full e-flex e-con e-child">
            <div className="rstb-site-logo">
              <Link href="/">
                <img src={settings.logo} alt={settings.siteName} />
              </Link>
            </div>
            <nav className="rstb-nav-menu">
              <ul className="primary-menu">
                {navItems.map((item) => (
                  <li key={item.id} className="menu-item">
                    <Link href={item.href} className="menu-item-link">
                      <span className="menu-item-text">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href={settings.searchUrl} className="rs-button style-default">
              Search
            </Link>
          </div>
          <div className="elementor-widget elementor-widget-fpg-post-ticker">
            <div className="elementor-widget-container">
              <div className="fpg-post-ticker">
                <span className="ticker-label">{tickerLabel}</span>
                <div className="ticker-items">
                  {tickerPosts.map((post) => (
                    <Link key={post.id} href={post.url} className="ticker-item">
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
