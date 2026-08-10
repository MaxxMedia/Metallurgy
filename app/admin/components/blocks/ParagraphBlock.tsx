"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { ParagraphBlock } from "../types";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface Props {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

export default function ParagraphBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3 text-gray-900">
      <label className="font-semibold text-sm text-gray-900 block">Paragraph</label>
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden [&_.ql-container]:bg-white [&_.ql-container]:text-gray-900 [&_.ql-container]:text-base [&_.ql-editor]:text-gray-900 [&_.ql-editor]:min-h-[150px] [&_.ql-editor.ql-blank::before]:text-gray-500 [&_.ql-editor.ql-blank::before]:not-italic [&_.ql-snow_.ql-stroke]:stroke-gray-700 [&_.ql-snow_.ql-fill]:fill-gray-700 [&_.ql-snow_.ql-picker]:text-gray-700">
        <ReactQuill
          theme="snow"
          value={block.content || ""}
          onChange={(value) =>
            onChange({
              ...block,
              content: value,
            })
          }
        />
      </div>
    </div>
  );
}
