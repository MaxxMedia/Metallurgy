import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - METALLURGY",
  description: "Learn about METALLURGY - your premier destination for technology, software, and robotics news.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Our Story &amp; Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Empowering the Future of Tech Reporting
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          METALLURGY delivers concise, accurate, and trustworthy technology news covering artificial intelligence, cloud architectures, robotics, and next-generation electronics.
        </p>
      </div>

      {/* Feature Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="text-3xl font-black text-emerald-400">100K+</div>
          <div className="text-sm font-bold text-white">Active Readers</div>
          <p className="text-xs text-slate-400">Monthly developers, executives, and tech enthusiasts.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="text-3xl font-black text-cyan-400">500+</div>
          <div className="text-sm font-bold text-white">Articles Published</div>
          <p className="text-xs text-slate-400">Comprehensive coverage across key technological domains.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="text-3xl font-black text-emerald-400">24/7</div>
          <div className="text-sm font-bold text-white">Global Newsroom</div>
          <p className="text-xs text-slate-400">Continuous monitoring of breaking industry updates.</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Why Readers Trust Us</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In an era of information overload, METALLURGY distills complex engineering developments into readable, actionable insights. We focus on factual reporting without sensationalism.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-400 text-base"></i>
              <span>Unbiased analysis of AI models, frameworks, and hardware</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-400 text-base"></i>
              <span>Expert commentary on cloud growth, security, and governance</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-400 text-base"></i>
              <span>In-depth look at consumer electronics and industrial automation</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Our Editorial Values</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We adhere to rigorous journalistic integrity, transparency in sources, and continuous verification. Our global editorial team brings years of experience across software engineering and digital media.
          </p>
          <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              M
            </div>
            <div>
              <div className="text-xs font-bold text-white">Editorial Board</div>
              <div className="text-[10px] text-emerald-400 font-semibold">METALLURGY Media Group</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
