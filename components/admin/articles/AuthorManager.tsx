"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/admin-ui";
import { apiFetch } from "@/lib/admin/api";
import { getApiBaseUrl } from "@/lib/auth/session";
import { EditAuthorModal } from "./EditAuthorModal";

export type AuthorRow = {
  id: number;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

export function AuthorManager({ token }: { token: string }) {
  const [authors, setAuthors] = useState<AuthorRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Edit modal state
  const [editingAuthor, setEditingAuthor] = useState<AuthorRow | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiFetch<AuthorRow[]>("/api/authors", token);
    if (res.error) setError(res.error);
    else setAuthors(Array.isArray(res.data) ? res.data : []);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void fetchAuthors();
  }, [fetchAuthors]);

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!name.trim()) {
      setCreateError("Author name is required");
      return;
    }

    setCreateLoading(true);

    let finalAvatarUrl = avatarUrl.trim() || undefined;

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadRes = await fetch(`${getApiBaseUrl()}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await uploadRes.json();
        if (uploadRes.ok && json.imageUrl) {
          finalAvatarUrl = json.imageUrl;
        } else {
          setCreateLoading(false);
          setCreateError("Failed to upload avatar photo.");
          return;
        }
      } catch {
        setCreateLoading(false);
        setCreateError("Failed to upload avatar photo.");
        return;
      }
    }

    const res = await apiFetch<AuthorRow>("/api/authors", token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatarUrl: finalAvatarUrl,
      }),
    });
    setCreateLoading(false);

    if (res.error) {
      setCreateError(res.error);
    } else if (res.data) {
      setCreateSuccess(`Author "${res.data.name}" created successfully!`);
      setAuthors((prev) => (prev ? [...prev, res.data!] : [res.data!]));
      setName("");
      setBio("");
      setAvatarUrl("");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleDeleteAuthor = async (author: AuthorRow) => {
    if (!confirm(`Are you sure you want to delete author "${author.name}"?`)) {
      return;
    }
    setActionMessage(null);
    setDeletingId(author.id);

    const res = await apiFetch<{ message?: string }>(
      `/api/authors/${author.id}`,
      token,
      { method: "DELETE" },
    );
    setDeletingId(null);

    if (res.error) {
      setActionMessage({ type: "error", text: res.error });
    } else {
      setAuthors((prev) => (prev ? prev.filter((a) => a.id !== author.id) : []));
      setActionMessage({
        type: "success",
        text: `Author "${author.name}" deleted successfully.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Author Section */}
      <SectionCard title="Create New Author">
        <form onSubmit={handleCreateAuthor} className="space-y-5">
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
                htmlFor="author-name"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70"
              >
                Author Name <span className="text-red-400">*</span>
              </label>
              <input
                id="author-name"
                type="text"
                required
                placeholder="e.g. Dr. Robert Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:bg-[#0d111a] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70">
                Author Avatar Photo (Upload File or URL)
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSelectedFile(f);
                      setPreviewUrl(URL.createObjectURL(f));
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/80 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0073ff] file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-[#0062d9]"
                />
                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:outline-none"
                />
                {previewUrl ? (
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-8 w-8 rounded-full object-cover border border-white/20"
                    />
                    <span className="text-xs text-emerald-400">Photo selected for upload</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="author-bio"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70"
            >
              Short Bio (Optional)
            </label>
            <textarea
              id="author-bio"
              rows={2}
              placeholder="e.g. Senior Metallurgy Engineer & Tech Columnist"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:bg-[#0d111a] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
            />
          </div>

          <div className="flex justify-end pt-2">
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
                  <i className="ri-user-add-line text-base" />
                  Create Author
                </>
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Action Notification */}
      {actionMessage ? (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-md ${
            actionMessage.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          <i
            className={
              actionMessage.type === "error"
                ? "ri-error-warning-fill text-xl text-red-400"
                : "ri-checkbox-circle-fill text-xl text-emerald-400"
            }
          />
          <span>{actionMessage.text}</span>
        </div>
      ) : null}

      {/* Author List */}
      <SectionCard
        title="All Authors"
        action={
          authors ? (
            <span className="text-xs tabular-nums text-white/40">
              {authors.length} total
            </span>
          ) : null
        }
      >
        {loading ? (
          <div className="py-12 text-center text-sm text-white/50">
            <i className="ri-loader-4-line mr-2 animate-spin text-xl text-[#0073ff]" />
            Loading authors...
          </div>
        ) : error ? (
          <div className="text-sm text-red-300">{error}</div>
        ) : authors && authors.length ? (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0b0e15]/50">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-white/[0.04] text-[11px] font-semibold uppercase tracking-wider text-white/45">
                  <th className="px-5 py-4 font-semibold">Author</th>
                  <th className="px-5 py-4 font-semibold">Bio</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr
                    key={author.id}
                    className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0073ff]/20 text-xs font-bold text-[#7eb8ff] shadow-sm">
                          {author.avatarUrl ? (
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            author.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{author.name}</p>
                          <p className="text-xs text-white/40">ID: #{author.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-white/70">
                      <p className="line-clamp-2 text-xs">
                        {author.bio || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAuthor(author)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
                        >
                          <i className="ri-edit-line text-sm text-[#0073ff]" />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === author.id}
                          onClick={() => handleDeleteAuthor(author)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {deletingId === author.id ? (
                            <i className="ri-loader-4-line animate-spin" />
                          ) : (
                            <i className="ri-delete-bin-line text-sm text-red-400" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-white/45">
            No authors created yet.
          </div>
        )}
      </SectionCard>

      {/* Edit Author Modal */}
      {editingAuthor ? (
        <EditAuthorModal
          author={editingAuthor}
          token={token}
          onClose={() => setEditingAuthor(null)}
          onSuccess={(updated) => {
            setAuthors((prev) =>
              prev ? prev.map((a) => (a.id === updated.id ? updated : a)) : [],
            );
            setEditingAuthor(null);
            setActionMessage({
              type: "success",
              text: `Author "${updated.name}" updated successfully.`,
            });
          }}
        />
      ) : null}
    </div>
  );
}
