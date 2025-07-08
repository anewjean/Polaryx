import { useCallback } from "react";
import { useFileStore } from "@/store/fileStore";
import { useMessageStore } from "@/store/messageStore";
import { putPresignedUrl, uploadFile } from "@/apis/fileImport";

export function useFilePreview(editor: any, fileInputRef: React.RefObject<HTMLInputElement>) {
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      useFileStore.getState().setFile(file || null); // file store에 file 저장

      // 파일 업로드 전 presignedUrl 발급
      const { presignedUrl, fileKey } = await putPresignedUrl(file as File);
      // 파일 업로드
      const fileUrl = await uploadFile(file as File, presignedUrl);

      // 파일 url 저장
      useMessageStore.getState().setFileUrl(fileUrl);

      if (file && editor) {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB 이하여야 합니다.");
          return;
        }

        // 파일을 base64로 변환
        const base64 = await convertFileToBase64(file);

        // 에디터에 이미지 삽입
        if (file.type.startsWith("image/")) {
          editor.chain().focus().setImage({ src: base64 }).run();
        } else {
          const ext = file.name.split(".").pop()?.toLowerCase() || "";

          let defaultImg = "/upload_default.png"; // 기본값

          if (ext === "pdf") defaultImg = "/upload_default.png";
          else if (["doc", "docx"].includes(ext)) defaultImg = "/upload_default.png";
          else if (["xls", "xlsx"].includes(ext)) defaultImg = "/upload_default.png";
          else if (["ppt", "pptx"].includes(ext)) defaultImg = "/upload_default.png";

          editor.chain().focus().setImage({ src: defaultImg }).run();
        }

        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor],
  );

  return { handleFileSelect, convertFileToBase64 };
}
