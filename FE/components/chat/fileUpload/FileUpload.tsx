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
      const fileName = fileUrl.split("/").pop();

      const result = await getPresignedUrl({ name: fileName } as File);
      if (!result) {
        alert("다운로드 실패");
        return;
      }

      const { presignedUrl } = result;
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
