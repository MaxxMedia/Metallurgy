"use client";

import { ContentBlock } from "./types";

interface Props {
  onAdd(block: ContentBlock): void;
}

export default function AddBlock({ onAdd }: Props) {
  function create(type: ContentBlock["type"]) {
    const id = crypto.randomUUID();

    switch (type) {
      case "paragraph":
        onAdd({
          id,
          type,
          content: "",
        });
        break;

      case "heading":
        onAdd({
          id,
          type,
          text: "",
          level: 2,
        });
        break;

      case "image":
        onAdd({
          id,
          type,
          imageUrl: "",
          caption: "",
          alt: "",
        });
        break;

      case "gallery":
        onAdd({
          id,
          type,
          images: [],
          columns: 3,
        });
        break;

      case "quote":
        onAdd({
          id,
          type,
          quote: "",
        });
        break;
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm text-gray-900">
      <h3 className="font-semibold text-gray-900 mb-4">Add Block</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => create("paragraph")}
          className="border border-gray-300 bg-white font-medium text-gray-900 rounded-lg p-3 hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xs"
        >
          📝 Paragraph
        </button>

        <button
          type="button"
          onClick={() => create("heading")}
          className="border border-gray-300 bg-white font-medium text-gray-900 rounded-lg p-3 hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xs"
        >
          📌 Heading
        </button>

        <button
          type="button"
          onClick={() => create("image")}
          className="border border-gray-300 bg-white font-medium text-gray-900 rounded-lg p-3 hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xs"
        >
          🖼️ Image
        </button>

        <button
          type="button"
          onClick={() => create("gallery")}
          className="border border-gray-300 bg-white font-medium text-gray-900 rounded-lg p-3 hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xs"
        >
          🎨 Gallery
        </button>

        <button
          type="button"
          onClick={() => create("quote")}
          className="border border-gray-300 bg-white font-medium text-gray-900 rounded-lg p-3 hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xs"
        >
          💬 Quote
        </button>
      </div>
    </div>
  );
}
