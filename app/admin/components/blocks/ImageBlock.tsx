"use client";

import UploadBox from "@/components/UploadBox";
import { getApiBaseUrl, readSession } from "@/lib/auth/session";
import { ImageBlock } from "../types";

interface Props {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}

export default function ImageBlockEditor({ block, onChange }: Props) {
  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const apiUrl = getApiBaseUrl();
    const session = readSession();

    const headers: Record<string, string> = {};
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;

    try {
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        onChange({
          ...block,
          imageUrl: data.imageUrl,
        });
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch {
      alert("Image upload request failed");
    }
  }

  return (
    <div className="space-y-4 text-gray-900">
      <h3 className="font-semibold text-gray-900">Image Block</h3>

      <UploadBox
        label="Upload Image"
        value={block.imageUrl}
        onUpload={handleUpload}
        accept="image/*"
        height="h-48"
        uploadType="image"
      />

      <input
        type="text"
        placeholder="Caption (optional)"
        value={block.caption || ""}
        onChange={(e) =>
          onChange({
            ...block,
            caption: e.target.value,
          })
        }
        className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <input
        type="text"
        placeholder="Alt text (optional)"
        value={block.alt || ""}
        onChange={(e) =>
          onChange({
            ...block,
            alt: e.target.value,
          })
        }
        className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
  );
}
