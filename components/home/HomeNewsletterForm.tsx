"use client";

import { useState } from "react";

export function HomeNewsletterForm() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      setSubscribed(true);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 text-center sm:text-left">
      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Subscribe to News Updates!
      </h3>
      <p className="text-sm text-slate-400">
        Join over 50,000+ tech professionals receiving daily digests on AI, software, and robotics.
      </p>

      {subscribed ? (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold text-sm">
          <i className="ri-checkbox-circle-fill text-lg align-middle mr-2"></i>
          Thank you for subscribing! You will now receive daily updates.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Subscribe</span>
              <i className="ri-send-plane-fill group-hover:translate-x-0.5 transition-transform"></i>
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer justify-center sm:justify-start">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            <span>
              I have read and agree to the{" "}
              <a href="/about-us" className="underline text-emerald-400 hover:text-emerald-300">
                terms &amp; conditions
              </a>
            </span>
          </label>
        </form>
      )}
    </div>
  );
}
