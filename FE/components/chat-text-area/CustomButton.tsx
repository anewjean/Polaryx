"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import ImagePreview from "./ImagePreview";

export default function CustomButton() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles([...files, ...selected]);
  };

  return (
    <div className="ml-5 mt-3">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 동그란 회색 버튼 */}
      <div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-[25px] h-[25px] rounded-full bg-gray-300 hover:bg-gray-500 active:bg-gray-700 transition-colors duration-200 shadow-md"
          title="파일 선택"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* 이미지 미리보기 */}
      {files.length > 0 && <ImagePreview files={files} />}
    </div>
  );
}
