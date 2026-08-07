type PostGroupVariant = "four" | "two";

type PostGroupProps = {
  variant: PostGroupVariant;
  total: number;
  className?: string;
  children: React.ReactNode;
};

export function PostGroup({ variant, total, className = "", children }: PostGroupProps) {
  const variantClass =
    variant === "four" ? "fpg-post-group fpg-post-group-four" : "fpg-post-group fpg-post-group-two";

  return (
    <div
      className={`${variantClass} ${className}`.trim()}
      style={{ "--total-post": total } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
