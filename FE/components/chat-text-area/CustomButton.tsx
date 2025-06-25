"use client";

import { useState } from "react";
import ImagePreview from "./ImagePreview";

export default function CustomButton() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles([...files, ...selected]);
  };

  return (
    <div className="container mx-auto p-8">
      {/* 파일 선택 */}
      <div className="mb-6">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* 이미지 미리보기 */}
      {files.length > 0 && <ImagePreview files={files} />}
    </div>
  );
}
