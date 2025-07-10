import { Button } from "@/components/ui/button";
import { getPresignedUrl } from "@/apis/fileImport";
import { useFileStore } from "@/store/fileStore";

export function FileDownload() {
  const file = useFileStore((state) => state.file);
  if (!file) return null;

  const handleDownload = async () => {
    try {
      const result = await getPresignedUrl(file);
      // presigned URL 요청

      if (!result || !result.presignedUrl) {
        alert("다운로드 URL을 가져오지 못했음");
        return;
      }

      // 새 창에서 다운로드(혹은 fetch+blob 방식도 가능)
      window.open(result.presignedUrl, "_blank");
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
