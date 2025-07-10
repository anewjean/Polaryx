import { Button } from "@/components/ui/button";
import { getPresignedUrl } from "@/apis/fileImport";
import { useFileStore } from "@/store/fileStore";

export function FileDownload() {
  const file = useFileStore((state) => state.file);
  if (!file) return null;

  const handleDownload = async () => {
      const result = await getPresignedUrl(file);
      if (!result) {
        alert("다운로드 실패");
        throw new Error("presignedUrl 요청 실패");
      }
      const { presignedUrl } = result
      window.open(presignedUrl, "_blank");
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      file download
    </Button>
  );
}
