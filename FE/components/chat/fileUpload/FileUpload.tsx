import { Button } from "@/components/ui/button";
import { getPresignedUrl } from "@/apis/fileImport";
import { useFileStore } from "@/store/fileStore";

export function FileDownload() {
  const file = useFileStore((state) => state.file);
  if (!file) return null;

  const handleDownload = async () => {
    try {
      // presigned URL 요청
      const { presignedUrl } = await getPresignedUrl(file);

      // 새 창에서 다운로드(혹은 fetch+blob 방식도 가능)
      window.open(presignedUrl, "_blank");
    } catch (e) {
      alert("다운로드 실패");
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      file download
    </Button>
  );
}
