"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/admin/api";
import { getApiBaseUrl } from "@/lib/auth/session";
import type { AuthorRow } from "./AuthorManager";

type EditAuthorModalProps = {
  author: AuthorRow;
  token: string;
  onClose: () => void;
  onSuccess: (updated: AuthorRow) => void;
};

export function EditAuthorModal({
  author,
  token,
  onClose,
  onSuccess,
}: EditAuthorModalProps) {
  const [editName, setEditName] = useState(author.name);
  const [editBio, setEditBio] = useState(author.bio || "");
  const [editAvatarUrl, setEditAvatarUrl] = useState(author.avatarUrl || "");
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleUpdateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Author name is required");
      return;
    }

    setEditLoading(true);

    let finalAvatarUrl = editAvatarUrl.trim() || undefined;

    if (editSelectedFile) {
      try {
        const formData = new FormData();
        formData.append("image", editSelectedFile);

        const uploadRes = await fetch(`${getApiBaseUrl()}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const json = await uploadRes.json();
        if (uploadRes.ok && json.imageUrl) {
          finalAvatarUrl = json.imageUrl;
        } else {
          setEditLoading(false);
          setEditError("Failed to upload avatar photo.");
          return;
        }
      } catch {
        setEditLoading(false);
        setEditError("Failed to upload avatar photo.");
        return;
      }
    }

    const res = await apiFetch<AuthorRow>(
      `/api/authors/${author.id}`,
      token,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          bio: editBio.trim() || undefined,
          avatarUrl: finalAvatarUrl,
        }),
      },
    );
    setEditLoading(false);

    if (res.error) {
      setEditError(res.error);
    } else if (res.data) {
      onSuccess(res.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121622] p-6 md:p-8 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <h3 className="text-lg font-bold text-white">Edit Author Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <form onSubmit={handleUpdateAuthor} className="space-y-5">
          {editError ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <i className="ri-error-warning-fill text-lg text-red-400" />
              <span>{editError}</span>
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70">
              Author Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:bg-[#0d111a] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70">
              Avatar Photo (Upload File or Direct URL)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setEditSelectedFile(f);
                    setEditPreviewUrl(URL.createObjectURL(f));
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/80 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0073ff] file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-[#0062d9]"
              />
              <input
                type="text"
                placeholder="Or paste image URL (https://...)"
                value={editAvatarUrl}
                onChange={(e) => setEditAvatarUrl(e.target.value)}
                className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:outline-none"
              />
              {editPreviewUrl ? (
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={editPreviewUrl}
                    alt="Preview"
                    className="h-8 w-8 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-xs text-emerald-400">New photo selected</span>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/70">
              Bio
            </label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full rounded-xl border border-white/[0.12] bg-[#0b0e14] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-[#0073ff] focus:bg-[#0d111a] focus:outline-none focus:ring-2 focus:ring-[#0073ff]/30"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="rounded-xl bg-gradient-to-r from-[#0073ff] to-[#0055ff] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,115,255,0.35)] hover:shadow-[0_6px_24px_rgba(0,115,255,0.5)] disabled:opacity-50"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
