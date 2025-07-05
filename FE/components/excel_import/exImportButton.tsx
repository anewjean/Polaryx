import { Button } from "@/components/ui/button";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { filterUsers } from "./validation";
import { usePathname } from "next/navigation";
import { createUsers } from "@/apis/excelApi";

export function ExUpload() {
  const workspaceId = usePathname().split("/")[2];
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      alert("엑셀 파일만 업로드 가능합니다 (.xlsx, .xls)");
      return;
    }

    // excel 파일을 읽어옴
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // 형식에 맞지 않은 user를 제거
    const { users, errors, total } = filterUsers(jsonData);

    const memberList = users.map((user) => ({
      name: user.name,
      email: user.email,
      workspace_id: workspaceId,
    }));

    createUsers(memberList);
    console.log(memberList); // note : 삭제 필요
  };

  return (
    <>
      <Button onClick={handleClick} variant="secondary">
        Excel에서 가져오기
      </Button>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} ref={inputRef} className="hidden" />
    </>
  );
}
