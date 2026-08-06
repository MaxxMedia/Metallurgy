import { readHeadStylesConfig } from "@/lib/extracted-content";

type LegacyHeadStylesProps = {
  cssHref: string;
};

export function LegacyHeadStyles({ cssHref }: LegacyHeadStylesProps) {
  const head = readHeadStylesConfig();

  return (
    <>
      <link rel="stylesheet" href={cssHref} />
      {head.fontFaces ? (
        <style type="text/css">{head.fontFaces}</style>
      ) : null}
      {head.elementorLazyCss ? (
        <style>{head.elementorLazyCss}</style>
      ) : null}
      {head.styleBlocks.map((block) => (
        <style key={block.id} id={block.id}>
          {block.content}
        </style>
      ))}
      <style id="nerio-remixicon-font-fix">{`
        @font-face {
          font-family: remixicon;
          src: url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.woff2") format("woff2");
          font-display: swap;
        }
      `}</style>
    </>
  );
}
