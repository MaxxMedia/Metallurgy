"use client";

import { QuoteBlock } from "../types";

interface Props {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
}

export default function QuoteBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4 text-gray-900">
      <label className="font-semibold text-gray-900 block">Quote</label>

      <textarea
        rows={5}
        value={block.quote || ""}
        placeholder="Enter quote..."
        onChange={(e) =>
          onChange({
            ...block,
            quote: e.target.value,
          })
        }
        className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg p-3 italic focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
  );
}
