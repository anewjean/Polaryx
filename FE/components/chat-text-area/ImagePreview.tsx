"use client";

import { useState, useEffect } from "react";

interface ImagePreviewProps {
  files: File[];
}

export default function ImagePreview({ files }: ImagePreviewProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  // 파일이 변경될 때마다 미리보기 생성
  useEffect(() => {
    const generatePreviews = async () => {
      const newPreviews = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }),
      );
      setPreviews(newPreviews);
    };

    generatePreviews();
  }, [files]);

  return (
    <div className="p-4 border rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div key={index} className="border rounded-lg p-2">
            <img
              src={previews[index]}
              alt={file.name}
              className="w-full h-32 object-cover rounded"
            />
            <p className="text-sm mt-2 truncate">{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
