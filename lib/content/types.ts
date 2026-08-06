/** Mirror export: main column HTML + Elementor body class and asset bundle hashes. */
export type MirrorPagePayload = {
  title: string;
  bodyClass: string;
  cssHash: string;
  jsHash: string;
  mainHtml: string;
};

export type StaticPageSlug =
  | "about-us"
  | "contact"
  | "login"
  | "register"
  | "blog"
  | "search";
