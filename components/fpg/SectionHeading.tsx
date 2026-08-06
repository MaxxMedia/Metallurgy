import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  viewAllHref?: string;
  level?: "h2" | "h4";
  headingId?: string;
  dividerId?: string;
  buttonId?: string;
  showDivider?: boolean;
  viewAllWithIcon?: boolean;
};

export function SectionHeading({
  title,
  viewAllHref,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 my-4 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-emerald-500"></div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          {title}
        </h2>
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          <span>View All</span>
          <i className="ri-arrow-right-line text-sm group-hover:translate-x-0.5 transition-transform"></i>
        </Link>
      )}
    </div>
  );
}
