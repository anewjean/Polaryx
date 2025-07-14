import { putPresignedUrl, uploadFile } from "@/apis/fileImport";

export function useProfileImageUpload() {
  const uploadToS3 = async (file: File) => {
    const result = await putPresignedUrl(file);
    if (!result) {
      throw new Error("Failed to get presigned URL");
    }
    const fileUrl = await uploadFile(file, result.presignedUrl);
    return fileUrl;
  };

  return { uploadToS3 };
}
