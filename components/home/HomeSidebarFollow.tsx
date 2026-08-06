import { HOME_SIDEBAR_SOCIAL } from "@/lib/home-sidebar-social";

export function HomeSidebarFollow() {
  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
      <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
        <i className="ri-share-forward-fill text-emerald-400"></i>
        Follow Us
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {HOME_SIDEBAR_SOCIAL.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all duration-200 text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 text-lg group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="mt-1.5 text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
              {item.label}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {item.subText}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
