"use client";

import Link from "next/link";

export function Footer() {
  const categories = [
    { name: "Tech", href: "/category/tech" },
    { name: "Software", href: "/category/software" },
    { name: "Automation", href: "/category/automation" },
    { name: "Innovation", href: "/category/innovation" },
    { name: "Robotics", href: "/category/robotics" },
    { name: "Future", href: "/category/future" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
    { name: "Latest Blog", href: "/blog" },
    { name: "Sign In", href: "/login" },
    { name: "Create Account", href: "/register" },
    { name: "Search News", href: "/search" },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
                M
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                METALLURGY
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Concise, clear, and credible technology reporting. Covering breaking developments in AI, cloud computing, automation, robotics, and next-gen electronics.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                aria-label="Twitter"
              >
                <i className="ri-twitter-x-line"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                aria-label="GitHub"
              >
                <i className="ri-github-fill"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                aria-label="LinkedIn"
              >
                <i className="ri-linkedin-fill"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                aria-label="RSS"
              >
                <i className="ri-rss-line"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="hover:text-emerald-400 transition-colors inline-block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-400 transition-colors inline-block py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Stay Informed
            </h3>
            <p className="text-xs text-slate-400">
              Get the latest tech digests delivered straight to your inbox daily.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-md"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} METALLURGY Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/about-us" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about-us" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
