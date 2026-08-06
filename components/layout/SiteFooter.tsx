import Link from "next/link";
import type { Author, Category, Post, SiteMenus, SiteSettings, Tag } from "@/types/data";
import { PostCard } from "@/components/fpg/PostCard";

type SiteFooterProps = {
  settings: SiteSettings;
  menus: SiteMenus;
  recentPosts: Post[];
  tags: Tag[];
  authors: Author[];
  categories: Category[];
};

export function SiteFooter({
  settings,
  menus,
  recentPosts,
  tags,
  authors,
  categories,
}: SiteFooterProps) {
  return (
    <footer className="rstb-footer">
      <div data-elementor-type="wp-post" data-elementor-id="129" className="elementor elementor-129">
        <div className="elementor-element e-con-full e-flex e-con e-parent">
          <div className="elementor-element e-flex e-con-boxed e-con e-child">
            <div className="e-con-inner">
              <div className="rstb-site-logo">
                <Link href="/">
                  <img src={settings.logo} alt={settings.siteName} />
                </Link>
              </div>
              <p>{settings.tagline}</p>
              <div className="rs-social-menu style1">
                <div className="social-wrapper">
                  {settings.socialLinks.map((link) => (
                    <a key={link.id} href={link.href} aria-label={link.label}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-element e-con-full e-flex e-con e-child">
            <h5 className="elementor-heading-title elementor-size-default">
              Top Categories
            </h5>
            <div className="rstb-nav-menu nav-vertical">
              <ul className="primary-menu">
                {menus.footerCategories.map((item) => (
                  <li key={item.id} className="menu-item">
                    <Link href={item.href} className="menu-item-link">
                      <span className="menu-item-text">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="elementor-element e-con-full e-flex e-con e-child">
            <h5 className="elementor-heading-title elementor-size-default">Recent Post</h5>
            <div className="fpg-post-parent">
              <div className="fpg-post-grid">
                {recentPosts.slice(0, 3).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    authors={authors}
                    categories={categories}
                    variant="two"
                    titleTag="h6"
                    thumbSize="thumb"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="elementor-element e-con-full e-flex e-con e-child">
            <h5 className="elementor-heading-title elementor-size-default">Tags</h5>
            <div className="ultimate-tag-cloud-container style-block">
              <div className="ultimate-tag-cloud-words block">
                {tags.map((tag) => (
                  <div key={tag.id} className="tag-word-wrap">
                    <Link href={tag.url} className="ultimate-tag-cloud-word" title={tag.name}>
                      {tag.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="rstb-copyright">
            © {new Date().getFullYear()} {settings.siteName}. Powered by{" "}
            <a href="https://rstheme.com/">RSTheme</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
