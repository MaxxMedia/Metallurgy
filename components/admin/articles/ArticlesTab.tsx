"use client";

import { useState } from "react";
import { ArticleListAndForm } from "./ArticleListAndForm";
import { AuthorManager } from "./AuthorManager";
import { CategoryManager } from "./CategoryManager";

type SubTab = "articles" | "authors" | "categories";

export function ArticlesTab({ token }: { token: string }) {
  const [subTab, setSubTab] = useState<SubTab>("articles");

  const NAV_ITEMS: { id: SubTab; label: string; icon: string; countHint?: string }[] = [
    { id: "articles", label: "Articles Catalog", icon: "ri-article-line" },
    { id: "authors", label: "Authors", icon: "ri-user-3-line" },
    { id: "categories", label: "Categories", icon: "ri-price-tag-3-line" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-[#0a0d14]/90 p-1.5 backdrop-blur-md shadow-lg">
        {NAV_ITEMS.map((item) => {
          const active = subTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubTab(item.id)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-[#0073ff] to-[#0055ff] text-white shadow-[0_4px_16px_rgba(0,115,255,0.35)]"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <i className={`${item.icon} text-sm`} aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Sub View */}
      {subTab === "articles" ? <ArticleListAndForm token={token} /> : null}
      {subTab === "authors" ? <AuthorManager token={token} /> : null}
      {subTab === "categories" ? <CategoryManager token={token} /> : null}
    </div>
  );
}
