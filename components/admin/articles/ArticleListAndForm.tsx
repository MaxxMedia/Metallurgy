"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SectionCard, StatusBadge } from "@/components/admin/admin-ui";
import { apiFetch } from "@/lib/admin/api";
import { getApiBaseUrl } from "@/lib/auth/session";
import type { AuthorRow } from "./AuthorManager";
import type { CategoryRow } from "./CategoryManager";
import PostBuilder from "@/app/admin/components/PostBuilder";
import type { ContentBlock } from "@/app/admin/components/types";

export type ArticleItem = {
  id: number;
  title: string;
  slug: string;
  badge?: string | null;
  excerpt?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  views?: number;
  status?: string;
  publishedAt?: string;
  author?: AuthorRow | null;
  category?: CategoryRow | null;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export function ArticleListAndForm({ token }: { token: string }) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [authorId, setAuthorId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [badge, setBadge] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // Social & Contact states
  const [facebookUrl, setFacebookUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [directImageUrl, setDirectImageUrl] = useState("");

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

  const fetchArticles = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      setError(null);
      const res = await apiFetch<{
        data: ArticleItem[];
        meta: PaginationMeta;
      }>(`/api/posts?page=${pageNum}&limit=10`, token);

      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setArticles(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
      setLoading(false);
    },
    [token],
  );

  const fetchDropdownData = useCallback(async () => {
    const [authorsRes, categoriesRes] = await Promise.all([
      apiFetch<AuthorRow[]>("/api/authors", token),
      apiFetch<CategoryRow[]>("/api/categories", token),
    ]);
    if (authorsRes.data && Array.isArray(authorsRes.data)) {
      setAuthors(authorsRes.data);
    }
    if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
      setCategories(categoriesRes.data);
    }
  }, [token]);

  useEffect(() => {
    void fetchArticles(currentPage);
  }, [currentPage, fetchArticles]);

  useEffect(() => {
    void fetchDropdownData();
  }, [fetchDropdownData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!title.trim() || !authorId || !categoryId || (!content.trim() && contentBlocks.length === 0)) {
      setCreateError("Title, Author, Category, and Content (or Content Blocks) are required.");
      return;
    }

    setCreateLoading(true);

    let finalImageUrl = directImageUrl.trim() || undefined;

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadRes = await fetch(`${getApiBaseUrl()}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.imageUrl) {
          setCreateLoading(false);
          setCreateError(uploadJson.error || "Failed to upload image.");
          return;
        }
        finalImageUrl = uploadJson.imageUrl;
      } catch {
        setCreateLoading(false);
        setCreateError("Image upload request failed.");
        return;
      }
    }

    let finalExcerpt = excerpt.trim();
    if (!finalExcerpt && contentBlocks.length > 0) {
      const firstParagraph = contentBlocks.find((b) => b.type === "paragraph") as { content?: string } | undefined;
      if (firstParagraph?.content) {
        finalExcerpt = firstParagraph.content.replace(/<[^>]+>/g, "").substring(0, 150) + "...";
      }
    } else if (!finalExcerpt && content.trim()) {
      finalExcerpt = content.replace(/<[^>]+>/g, "").substring(0, 150) + "...";
    }

    const articleSlug = slug.trim() || slugify(title);

    const res = await apiFetch<ArticleItem>("/api/posts", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        slug: articleSlug,
        authorId: Number(authorId),
        categoryId: Number(categoryId),
        content: content.trim(),
        contentBlocks: contentBlocks,
        excerpt: finalExcerpt || undefined,
        badge: badge.trim() || undefined,
        imageUrl: finalImageUrl,
        facebookUrl: facebookUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        twitterUrl: twitterUrl.trim() || undefined,
        youtubeUrl: youtubeUrl.trim() || undefined,
        email: email.trim() || undefined,
        whatsappNumber: whatsappNumber.trim() || undefined,
      }),
    });

    setCreateLoading(false);

    if (res.error) {
      setCreateError(res.error);
    } else if (res.data) {
      setCreateSuccess(`Article "${res.data.title}" published successfully!`);
      setTitle("");
      setSlug("");
      setSlugEdited(false);
      setBadge("");
      setExcerpt("");
      setContent("");
      setContentBlocks([]);
      setFacebookUrl("");
      setLinkedinUrl("");
      setTwitterUrl("");
      setYoutubeUrl("");
      setEmail("");
      setWhatsappNumber("");
      setSelectedFile(null);

      setPreviewUrl(null);
      setDirectImageUrl("");
      setShowCreateForm(false);
      void fetchArticles(1);
      setCurrentPage(1);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0c0f17]/90 p-5 backdrop-blur-md shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Articles & News</h2>
          <p className="mt-1 text-xs text-white/50">
            Publish articles, attach images, and manage public content.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/posts/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-500 hover:to-indigo-600 hover:scale-[1.01] active:scale-[0.99]"
          >
            <i className="ri-layout-grid-line text-lg" />
            <span>Create Post (Block Builder)</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setCreateError(null);
              setCreateSuccess(null);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0073ff] via-[#0088ff] to-[#0055ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,115,255,0.35)] transition-all duration-200 hover:shadow-[0_12px_30px_rgba(0,115,255,0.5)] hover:scale-[1.01] active:scale-[0.99]"
          >
            <i className={showCreateForm ? "ri-close-line text-lg" : "ri-add-line text-lg"} />
            <span>{showCreateForm ? "Close Form" : "Quick Compose"}</span>
          </button>
        </div>
      </div>

      {createSuccess ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 shadow-md">
          <i className="ri-checkbox-circle-fill text-xl text-emerald-400" />
          <span>{createSuccess}</span>
        </div>
      ) : null}

      {/* Expandable Form Card */}
      {showCreateForm ? (
        <SectionCard title="Compose & Publish Article">
          <form onSubmit={handleCreateArticle} className="space-y-6">
            {createError ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                <i className="ri-error-warning-fill text-xl text-red-400" />
                <span>{createError}</span>
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Powder Metallurgy Trends 2026"
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTitle(val);
                    if (!slugEdited) setSlug(slugify(val));
                  }}
                  className="w-full rounded-xl border border-black-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all duration-200 focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. advanced-powder-metallurgy-trends-2026"
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(e.target.value);
                  }}
                  className="w-full rounded-xl border border-black-300 bg-white px-4 py-2.5 font-mono text-sm font-medium text-black placeholder:text-gray-500 transition-all duration-200 focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                  Author <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full rounded-xl border border-black bg-black px-4 py-2.5 text-sm font-medium text-black transition-all duration-200 focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                >
                  <option value="" className="bg-white text-gray-700 font-medium">
                    Select Author
                  </option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id} className="bg-white text-black font-medium">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition-all duration-200 focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                >
                  <option value="" className="bg-white text-gray-700 font-medium">
                    Select Category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white text-black font-medium">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                  Badge / Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Featured, Hot News"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all duration-200 focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#090c12]/80 p-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                Article Featured Banner Image
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative flex flex-col justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] p-4 text-center transition-colors hover:border-[#0073ff]/50 hover:bg-white/[0.04]">
                  <i className="ri-image-add-line mx-auto mb-1 text-2xl text-[#0073ff]" />
                  <p className="text-xs font-medium text-white/80">Upload Photo File</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-white/70">
                    Or Direct Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo..."
                    value={directImageUrl}
                    onChange={(e) => setDirectImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all duration-200 focus:border-[#0073ff] focus:outline-none"
                  />
                </div>
              </div>

              {previewUrl ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-12 w-20 rounded-lg object-cover border border-white/20"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-emerald-300">
                      {selectedFile?.name}
                    </p>
                    <p className="text-[11px] text-emerald-400/70">
                      Ready for upload on submission
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-emerald-400/60 hover:text-emerald-300"
                  >
                    <i className="ri-close-circle-fill text-lg" />
                  </button>
                </div>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/90">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary to display in article listings and cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all duration-200 focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
              />
            </div>

            {/* Block Builder Section */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-white/90">
                Content Blocks & Builder <span className="text-red-400">*</span>
              </label>
              <PostBuilder
                value={contentBlocks}
                onChange={setContentBlocks}
              />
            </div>


            {/* SOCIAL / CONTACT */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#090c12]/80 p-5 space-y-4">
              <h3 className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
                <span>🔗 Social & Contact (Optional)</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/..."
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    Twitter/X URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://x.com/..."
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1234567890"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-gray-500 transition-all focus:border-[#0073ff] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
                  />
                </div>
              </div>
            </div>




            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0073ff] via-[#0088ff] to-[#0055ff] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(0,115,255,0.35)] transition-all hover:shadow-[0_12px_30px_rgba(0,115,255,0.5)] disabled:opacity-50"
              >
                {createLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-base" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-fill text-base" />
                    Publish Article
                  </>
                )}
              </button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      {/* Articles Table with Pagination */}
      <SectionCard
        title="Published Articles"
        action={
          <span className="text-xs tabular-nums text-white/40">
            {meta.total} total items
          </span>
        }
      >
        {loading ? (
          <div className="py-12 text-center text-sm text-white/50">
            <i className="ri-loader-4-line mr-2 animate-spin text-xl text-[#0073ff]" />
            Loading articles...
          </div>
        ) : error ? (
          <div className="text-sm text-red-300">{error}</div>
        ) : articles.length ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0b0e15]/50">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.04] text-[11px] font-semibold uppercase tracking-wider text-white/45">
                    <th className="px-5 py-4 font-semibold">Article</th>
                    <th className="px-5 py-4 font-semibold">Author</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Views</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-11 w-14 shrink-0 rounded-xl object-cover border border-white/10 shadow-sm"
                            />
                          ) : (
                            <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
                              <i className="ri-article-line text-xl" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white max-w-xs md:max-w-sm">
                              {item.title}
                            </p>
                            <p className="font-mono text-xs text-white/40 truncate max-w-xs">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-white/80">
                        {item.author?.name || "—"}
                      </td>
                      <td className="px-5 py-4 font-medium text-white/80">
                        {item.category?.name || "—"}
                      </td>
                      <td className="px-5 py-4 tabular-nums font-semibold text-white/75">
                        {item.views ?? 0}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status || "APPROVED"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/60">
              <div>
                Page <span className="font-semibold text-white">{meta.page}</span> of{" "}
                <span className="font-semibold text-white">{meta.pages || 1}</span> ({meta.total} total items)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= meta.pages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-white/45">
            No articles published yet.
          </div>
        )}
      </SectionCard>
    </div>
  );
}
