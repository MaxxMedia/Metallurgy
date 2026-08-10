"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { getApiBaseUrl, readSession } from "@/lib/auth/session";

interface UploadBoxProps {
  label: string;
  value?: string;
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  className?: string;
  height?: string;
  uploadType?: "image" | "document";
}

export default function UploadBox({
  label,
  value,
  onUpload,
  accept = "image/*,application/pdf",
  className = "",
  height = "aspect-video",
  uploadType = "image",
}: UploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      const isValidType = acceptedTypes.some((type) => {
        if (!type) return false;
        if (type.startsWith(".")) {
          return fileName.endsWith(type);
        }
        if (type.includes("/*")) {
          const category = type.split("/")[0];
          return fileType.startsWith(category + "/");
        }
        return fileType === type;
      });

      if (!isValidType) {
        alert(`Please upload a valid file type: ${accept}`);
        return;
      }
    }

    const maxSize = uploadType === "document" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      await uploadFile(file, uploadType);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(file.name);
      }

      await onUpload(file);
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      setUploadError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadFile = async (file: File, type: "image" | "document"): Promise<string> => {
    const formData = new FormData();
    const apiUrl = getApiBaseUrl();
    const session = readSession();

    if (type === "document") {
      formData.append("document", file);
      const endpoint = `${apiUrl}/api/upload/document`;

      const headers: Record<string, string> = {};
      if (session?.token) headers.Authorization = `Bearer ${session.token}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = `Upload failed with status ${res.status}`;
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `Server error (${res.status}). Please try again.`;
          }
        } catch {
          errorMessage = `Server error (${res.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (!data.documentUrl) {
        throw new Error("No document URL returned from server");
      }
      return data.documentUrl;
    } else {
      formData.append("image", file);
      const endpoint = `${apiUrl}/api/upload`;

      const headers: Record<string, string> = {};
      if (session?.token) headers.Authorization = `Bearer ${session.token}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = `Upload failed with status ${res.status}`;
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `Server error (${res.status}). Please try again.`;
          }
        } catch {
          errorMessage = `Server error (${res.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error("No image URL returned from server");
      }
      return data.imageUrl;
    }
  };

  const handleRemove = () => {
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImagePreview = preview && (preview.startsWith("data:image") || preview.startsWith("http") || preview.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i));

  return (
    <div className={`w-full ${className}`}>
      {preview ? (
        <div className="relative group text-gray-900">
          {isImagePreview ? (
            <div className={`relative w-full ${height} rounded-lg border border-gray-300 overflow-hidden bg-white`}>
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-300 min-h-[60px] text-gray-900">
              <span className="text-sm font-medium text-gray-900 truncate flex-1">
                {preview}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md z-10"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center w-full ${height} border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer bg-white hover:bg-gray-50 text-gray-900`}
        >
          <Upload className="w-8 h-8 text-gray-500 mb-2" />
          <p className="text-sm font-semibold text-gray-800 text-center px-4">
            {label}
          </p>
          {uploadError && (
            <p className="text-xs font-semibold text-red-600 mt-1">{uploadError}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
              <div className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                <span className="animate-spin">⏳</span> Uploading...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
