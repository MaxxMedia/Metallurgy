"use client";

import { HeadingBlock } from "../types";

interface Props {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

export default function HeadingBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3 text-gray-900 w-full">
      <label className="font-semibold text-sm text-gray-900 block">Heading</label>

      <div className="flex items-center gap-3 w-full">
        <select
          value={block.level || 2}
          onChange={(e) =>
            onChange({
              ...block,
              level: Number(e.target.value) as 1 | 2 | 3,
            })
          }
          className="!w-20 !min-w-[80px] !max-w-[80px] shrink-0 border border-gray-300 bg-white text-gray-900 rounded-lg px-2.5 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
        >
          <option value={1} className="bg-white text-gray-900 font-semibold">H1</option>
          <option value={2} className="bg-white text-gray-900 font-semibold">H2</option>
          <option value={3} className="bg-white text-gray-900 font-semibold">H3</option>
        </select>

        <input
          type="text"
          value={block.text || ""}
          placeholder="Enter heading..."
          onChange={(e) =>
            onChange({
              ...block,
              text: e.target.value,
            })
          }
          className="flex-1 min-w-0 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg px-4 py-2.5 text-base font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
