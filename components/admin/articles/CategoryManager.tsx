"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, SectionCard } from "@/components/admin/admin-ui";
import { apiFetch } from "@/lib/admin/api";

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
};

export function CategoryManager({ token }: { token: string }) {
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Creation state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiFetch<CategoryRow[]>("/api/categories", token);
    if (res.error) setError(res.error);
    else setCategories(Array.isArray(res.data) ? res.data : []);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setCreateError(null);
    setCreateSuccess(null);

    const name = newCategoryName.trim();
    const slug = newCategorySlug.trim() || slugify(name);

    if (!name || !slug) {
      setCreateError("Name and slug are required");
      return;
    }

    setCreateLoading(true);
    const res = await apiFetch<CategoryRow>("/api/categories", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    setCreateLoading(false);

    if (res.error) {
      setCreateError(res.error);
    } else if (res.data) {
      setCreateSuccess(`Category "${res.data.name}" created successfully!`);
      setCategories((prev) => (prev ? [res.data!, ...prev] : [res.data!]));
      setNewCategoryName("");
      setNewCategorySlug("");
      setSlugManuallyEdited(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Creation Form */}
      <SectionCard title="Create New Category">
        <form onSubmit={handleCreateCategory} className="space-y-5">
          {createError ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              <i className="ri-error-warning-fill text-xl text-red-400" />
              <span>{createError}</span>
            </div>
          ) : null}

          {createSuccess ? (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 shadow-md">
              <i className="ri-checkbox-circle-fill text-xl text-emerald-400" />
              <span>{createSuccess}</span>
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="cat-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70"
              >
                Category Name <span className="text-red-400">*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                required
                placeholder="e.g. Steel Metallurgy"
                value={newCategoryName}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewCategoryName(val);
                  if (!slugManuallyEdited) {
                    setNewCategorySlug(slugify(val));
                  }
                }}
                className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:bg-[#0d111a] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
              />
            </div>

            <div>
              <label
                htmlFor="cat-slug"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70"
              >
                Category Slug <span className="text-red-400">*</span>
              </label>
              <input
                id="cat-slug"
                type="text"
                required
                placeholder="e.g. steel-metallurgy"
                value={newCategorySlug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setNewCategorySlug(e.target.value);
                }}
                className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 font-mono text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:bg-[#0d111a] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">
              Categories organize articles, posts, and directory listings.
            </p>
            <button
              type="submit"
              disabled={createLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0073ff] via-[#0088ff] to-[#0055ff] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(0,115,255,0.35)] transition-all hover:shadow-[0_12px_30px_rgba(0,115,255,0.5)] disabled:opacity-50"
            >
              {createLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-base" />
                  Creating...
                </>
              ) : (
                <>
                  <i className="ri-price-tag-3-line text-base" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Category List */}
      <SectionCard
        title="All Categories"
        action={
          categories ? (
            <span className="text-xs tabular-nums text-white/40">
              {categories.length} total
            </span>
          ) : null
        }
      >
        {loading ? (
          <div className="py-12 text-center text-sm text-white/50">
            <i className="ri-loader-4-line mr-2 animate-spin text-xl text-[#0073ff]" />
            Loading categories...
          </div>
        ) : error ? (
          <div className="text-sm text-red-300">{error}</div>
        ) : categories ? (
          <DataTable
            columns={["ID", "Name", "Slug"]}
            rows={categories.map((cat) => [
              String(cat.id),
              cat.name,
              cat.slug,
            ])}
            renderCell={(col, value) => {
              if (col === 0) {
                return (
                  <span className="font-mono text-xs text-white/50">
                    #{value}
                  </span>
                );
              }
              if (col === 1) {
                return <span className="font-semibold text-white">{value}</span>;
              }
              return (
                <span className="font-mono text-xs text-white/60">
                  {value}
                </span>
              );
            }}
          />
        ) : null}
      </SectionCard>
    </div>
  );
}
