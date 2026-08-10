"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import UploadBox from "@/components/UploadBox";
import PostBuilder from "@/app/admin/components/PostBuilder";
import { ContentBlock } from "@/app/admin/components/types";
import { getApiBaseUrl, readSession } from "@/lib/auth/session";

type Author = {
  id: number;
  name: string;
  bio?: string;
  avatarUrl?: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function CreatePost() {
  const router = useRouter();

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    badge: string;
    imageUrl: string;
    excerpt: string;
    content: string;
    contentBlocks: ContentBlock[];
    authorId: string;
    categoryId: string;
    facebookUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    youtubeUrl: string;
    email: string;
    whatsappNumber: string;
  }>({
    title: "",
    slug: "",
    badge: "",
    imageUrl: "",
    excerpt: "",
    content: "",
    contentBlocks: [],
    authorId: "",
    categoryId: "",
    facebookUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    email: "",
    whatsappNumber: "",
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH AUTHORS & CATEGORIES ================= */
  useEffect(() => {
    const apiUrl = getApiBaseUrl();
    const session = readSession();
    const headers: Record<string, string> = {};
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    Promise.all([
      fetch(`${apiUrl}/api/authors`, { headers }).then((r) => r.json()),
      fetch(`${apiUrl}/api/categories`, { headers }).then((r) => r.json()),
    ])
      .then(([a, c]) => {
        setAuthors(Array.isArray(a) ? a : a.data || []);
        setCategories(Array.isArray(c) ? c : c.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch authors or categories:", err);
        setAuthors([]);
        setCategories([]);
      });
  }, []);

  /* ================= AUTO SLUG ================= */
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm((prev) => ({ ...prev, title, slug }));
  }

  function handleChange(
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /* ================= IMAGE UPLOAD ================= */
  async function handleImageUpload(file: File) {
    setUploading(true);
    setMessage("⏫ Uploading image...");
    const apiUrl = getApiBaseUrl();
    const session = readSession();

    try {
      const formData = new FormData();
      formData.append("image", file);

      const headers: Record<string, string> = {};
      if (session?.token) headers.Authorization = `Bearer ${session.token}`;

      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        setMessage("✅ Image uploaded successfully!");
      } else {
        throw new Error(data.error || "Image upload failed");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Image upload failed";
      setMessage(`❌ ${errMsg}`);
    } finally {
      setUploading(false);
    }
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const apiUrl = getApiBaseUrl();
    const session = readSession();
    const token = session?.token;

    // Generate excerpt from content blocks if no excerpt provided
    let excerpt = form.excerpt.trim();
    if (!excerpt && form.contentBlocks.length > 0) {
      const firstParagraph = form.contentBlocks.find(
        (block) => block.type === "paragraph"
      ) as { content?: string } | undefined;
      if (firstParagraph?.content) {
        excerpt =
          firstParagraph.content
            .replace(/<[^>]+>/g, "")
            .substring(0, 150) + "...";
      }
    } else if (!excerpt && form.content) {
      excerpt = form.content.replace(/<[^>]+>/g, "").substring(0, 150) + "...";
    }

    try {
      const res = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          excerpt,
          contentBlocks: form.contentBlocks,
          authorId: Number(form.authorId),
          categoryId: Number(form.categoryId),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Post created successfully!");
        setForm({
          title: "",
          slug: "",
          badge: "",
          imageUrl: "",
          excerpt: "",
          content: "",
          contentBlocks: [],
          authorId: "",
          categoryId: "",
          facebookUrl: "",
          linkedinUrl: "",
          twitterUrl: "",
          youtubeUrl: "",
          email: "",
          whatsappNumber: "",
        });
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setMessage(`❌ ${data?.error || "Something went wrong"}`);
      }
    } catch {
      setLoading(false);
      setMessage("❌ Network error");
    }
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center text-gray-900">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-indigo-700">
            📝 Create New Post
          </h1>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            ← Back to Admin Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleTitleChange}
              required
              placeholder="Enter post title"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="post-url-slug"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            />
            <p className="text-xs text-gray-600 mt-1">
              URL-friendly version of the title (auto-generated)
            </p>
          </div>

          {/* BADGE */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Badge
            </label>
            <input
              type="text"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="FEATURED, WEBINAR, EVENT"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Featured Image
            </label>
            <UploadBox
              label="Upload featured image"
              value={form.imageUrl}
              onUpload={handleImageUpload}
              accept="image/*"
              height="h-64"
              uploadType="image"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            >
              <option value="" className="bg-white text-gray-900">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-gray-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* AUTHOR */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <select
              name="authorId"
              value={form.authorId}
              onChange={handleChange}
              required
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            >
              <option value="" className="bg-white text-gray-900">Select author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id} className="bg-white text-gray-900">
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* EXCERPT */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Short summary (optional - auto-generated from content)"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block font-semibold text-gray-900 mb-4">
              Content <span className="text-red-500">*</span>
            </label>
            <PostBuilder
              value={form.contentBlocks}
              onChange={(blocks) =>
                setForm((prev) => ({
                  ...prev,
                  contentBlocks: blocks,
                }))
              }
            />
          </div>

          {/* SOCIAL / CONTACT */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              🔗 Social & Contact (Optional)
            </h3>
            <div className="space-y-3">
              <input
                name="facebookUrl"
                value={form.facebookUrl}
                onChange={handleChange}
                placeholder="Facebook URL"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
              />
              <input
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
              />
              <input
                name="twitterUrl"
                value={form.twitterUrl}
                onChange={handleChange}
                placeholder="Twitter/X URL"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
              />
              <input
                name="youtubeUrl"
                value={form.youtubeUrl}
                onChange={handleChange}
                placeholder="YouTube URL"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Contact Email"
                type="email"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
              />
              <input
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="WhatsApp Number (e.g., +1234567890)"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              "🚀 Create Post"
            )}
          </button>

          {/* MESSAGE */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes("✅") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              <p className="text-center text-sm font-semibold">{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
