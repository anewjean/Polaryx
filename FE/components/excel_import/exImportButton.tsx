import { Button } from "@/components/ui/button";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { filterUsers } from "./validation";
import { usePathname } from "next/navigation";
import { createUsers, getWorkspaceColumns } from "@/apis/excelApi";

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

    const columns: string[] = [];
    const res = await getWorkspaceColumns();
    res.map((item: any) => {
      columns.push(item[0]);
    });

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // 맨 위의 필드명(헤더)만 추출
    const columnsHeader = rows[0]; // 예: ['email', 'name', 'role', ...]
    // 공통 컬럼 찾기
    const commonColumns = columnsHeader.filter((header: string) => columns.includes(header));

    console.log("columns", columns);
    console.log("columnsHeader", columnsHeader);
    console.log("공통 컬럼:", commonColumns);

    // 형식에 맞지 않은 user를 제거
    const { users, errors, total } = filterUsers(jsonData);

    // const memberList = users.map((user) => ({
    //   email: user.email,
    //   name: user.name,
    //   workspace_id: workspaceId,
    // }));

    const memberList = users.map((user) => {
      const obj: any = {};
      commonColumns.forEach((col: string) => {
        obj[col] = user[col];
      });
      obj.name = user.name;
      obj.email = user.email;
      obj.workspace_id = workspaceId;
      return obj;
    });

    createUsers(memberList);
    console.log("memberList", memberList); // note : 삭제 필요
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
