export async function putPresignedUrl(file: File) {
  const res = await fetch("http://localhost:8000/api/s3/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      filetype: file.type,
    }),
  });
  const data = await res.json();
  const presignedUrl = data.url; // 서버에서 반환한 presigned URL
  const fileKey = data.key;

  return { presignedUrl, fileKey };
}

export async function getPresignedUrl(file: File) {
  const res = await fetch("http://localhost:8000/api/s3/presigned-url-get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      filetype: file.type,
    }),
  });
  if (!res.ok) throw new Error("presigned url 요청 실패");

  const data = await res.json();
  const presignedUrl = data.url;
  const fileKey = data.key;

  return { presignedUrl, fileKey };
}

export async function uploadFile(file: File, presignedUrl: string) {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type, // ex: "image/png"
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("파일 업로드 실패");
  }

  // 업로드 성공 후 이미지 URL 반환
  const fileUrl = presignedUrl.split("?")[0]; // query string 제거하면 정적 URL
  return fileUrl;
}
