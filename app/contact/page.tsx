"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact Our Newsroom
        </h1>
        <p className="text-sm text-slate-400">
          Have a press release, story tip, partnership query, or feedback? Send us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Sidebar (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Editorial Office</h3>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <i className="ri-map-pin-line text-sm"></i>
                </div>
                <div>
                  <div className="font-semibold text-white">Headquarters</div>
                  <p className="text-slate-400 mt-0.5">100 Tech Plaza, San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <i className="ri-mail-line text-sm"></i>
                </div>
                <div>
                  <div className="font-semibold text-white">Email Newsroom</div>
                  <p className="text-slate-400 mt-0.5">contact@metallurgytech.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <i className="ri-phone-line text-sm"></i>
                </div>
                <div>
                  <div className="font-semibold text-white">Press Inquiries</div>
                  <p className="text-slate-400 mt-0.5">+1 (800) 555-TECH</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Press &amp; Media Partnerships</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              For syndication requests, executive interviews, or conference coverage, reach out directly to our partnerships team.
            </p>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
                <i className="ri-checkbox-circle-fill"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. Our editorial team will review your message and reply promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Subject</label>
                <input
                  type="text"
                  placeholder="Story Tip / General Query"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>Submit Message</span>
                <i className="ri-send-plane-fill"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
