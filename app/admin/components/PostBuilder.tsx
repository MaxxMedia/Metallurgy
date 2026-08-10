"use client";

import { useEffect, useState } from "react";
import AddBlock from "./AddBlock";
import {
  ContentBlock,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  GalleryBlock,
  QuoteBlock,
} from "./types";
import ParagraphBlockEditor from "./blocks/ParagraphBlock";
import HeadingBlockEditor from "./blocks/HeadingBlock";
import ImageBlockEditor from "./blocks/ImageBlock";
import GalleryBlockEditor from "./blocks/GalleryBlock";
import QuoteBlockEditor from "./blocks/QuoteBlock";

interface Props {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function PostBuilder({ value, onChange }: Props) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(value || []);

  useEffect(() => {
    setBlocks(value || []);
  }, [value]);

  function updateBlocks(updated: ContentBlock[]) {
    setBlocks(updated);
    onChange(updated);
  }

  function addBlock(block: ContentBlock) {
    updateBlocks([...blocks, block]);
  }

  function updateBlock(id: string, updatedBlock: ContentBlock) {
    updateBlocks(
      blocks.map((block) => (block.id === id ? updatedBlock : block))
    );
  }

  function deleteBlock(id: string) {
    updateBlocks(blocks.filter((block) => block.id !== id));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const updated = [...blocks];
    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];
    updateBlocks(updated);
  }

  function moveDown(index: number) {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    [updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ];
    updateBlocks(updated);
  }

  return (
    <div className="space-y-6 text-gray-900">
      <AddBlock onAdd={addBlock} />

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="border border-gray-300 rounded-xl bg-white p-5 shadow-sm text-gray-900"
        >
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => moveUp(index)}
              className="border border-gray-300 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-100 transition text-sm font-semibold text-gray-800"
              disabled={index === 0}
            >
              ↑
            </button>

            <button
              type="button"
              onClick={() => moveDown(index)}
              className="border border-gray-300 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-100 transition text-sm font-semibold text-gray-800"
              disabled={index === blocks.length - 1}
            >
              ↓
            </button>

            <button
              type="button"
              onClick={() => deleteBlock(block.id)}
              className="border border-red-300 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition text-sm font-semibold"
            >
              ✕ Delete
            </button>
          </div>

          {block.type === "paragraph" && (
            <ParagraphBlockEditor
              block={block as ParagraphBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "heading" && (
            <HeadingBlockEditor
              block={block as HeadingBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "image" && (
            <ImageBlockEditor
              block={block as ImageBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "gallery" && (
            <GalleryBlockEditor
              block={block as GalleryBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "quote" && (
            <QuoteBlockEditor
              block={block as QuoteBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}
        </div>
      ))}

      {blocks.length === 0 && (
        <div className="text-center py-12 text-gray-600 border-2 border-dashed border-gray-300 rounded-xl bg-white font-medium">
          No blocks yet. Click "Add Block" above to start building your post content.
        </div>
      )}
    </div>
  );
}
