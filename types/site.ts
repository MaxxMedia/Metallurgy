export type InlineLegacyScript = {
  id: string;
  content: string;
};

export type HeadStylesConfig = {
  cssHref: string | null;
  jsBundle: string | null;
  fontFaces: string;
  elementorLazyCss: string;
  styleBlocks: { id: string; content: string }[];
};

export type PageAssets = {
  cssHref: string;
  jsBundle: string;
  cssHash: string;
  jsHash: string;
  bodyClass: string;
};
