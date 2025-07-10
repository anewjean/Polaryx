import { Button } from "@/components/ui/button";
import { getPresignedUrl } from "@/apis/fileImport";
import { useFileStore } from "@/store/fileStore";

interface FileDownloadProps {
  fileUrl: string;
}

export function FileDownload({ fileUrl }: FileDownloadProps) {
  // const file = useFileStore((state) => state.file);
  // if (!fileUrl) return null;

  const handleDownload = async () => {
    try {
      // file 명 추출
      const fileName = fileUrl.split("/").pop();

      // presigned URL 요청
      const { presignedUrl } = await getPresignedUrl({ name: fileName } as File);

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
