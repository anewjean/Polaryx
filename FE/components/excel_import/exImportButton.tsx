import { Button } from "@/components/ui/button";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { filterUsers } from "./validation";
import { usePathname } from "next/navigation";
import { createUsers } from "@/apis/excelApi";
import { detectTyposJaccard } from "./detectTyposJaccard";
import { useMemberStore } from "@/store/memberStore";

export function ExUpload() {
  const workspaceId = usePathname().split("/")[2];
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMemberList } = useMemberStore();

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

    // 엑셀 헤더 file 검사
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const uploadedHeaders = json[0];

    const typos = detectTyposJaccard(uploadedHeaders as string[]);
    if (typos.length > 0) {
      alert(`오타가 있습니다. ${typos.map((t) => t.wrong).join(", ")}`);
      return;
    }

    // 형식에 맞지 않은 user를 제거
    const { users, errors } = filterUsers(jsonData);
    const memberList = users.map((user) => ({
      email: user.email,
      name: user.name,
      role: user.role,
      group: user.group,
      blog: user.blog,
      github: user.github,
      workspace_id: workspaceId,
    }));

    // memberList를 store에 저장
    setMemberList(memberList);

    try {
      const result = await createUsers(memberList);
      alert(`성공적으로 등록된 유저 수: ${result.success_count}`);
    } catch (err) {
      alert("유저 등록에 실패했습니다.");
    }
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
