type LegacyHtmlProps = {
  html: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Avoid extra box when HTML includes semantic root elements (header/footer) */
  displayContents?: boolean;
};

export function LegacyHtml({
  html,
  as: Tag = "div",
  className,
  displayContents,
}: LegacyHtmlProps) {
  if (displayContents) {
    return (
      <div
        className={className}
        style={{ display: "contents" }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Tag
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
