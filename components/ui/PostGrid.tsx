type PostGridProps = {
  children: React.ReactNode;
  gridClassName?: string;
  parentClassName?: string;
};

export function PostGrid({ children, gridClassName = "", parentClassName = "" }: PostGridProps) {
  return (
    <div className={`fpg-post-parent w-full ${parentClassName}`.trim()}>
      <div className={`fpg-post-grid ${gridClassName}`.trim()}>{children}</div>
    </div>
  );
}
