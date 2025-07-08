import { Button } from "@/components/ui/button";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { filterUsers } from "./validation";
import { usePathname } from "next/navigation";
import { createUsers } from "@/apis/excelApi";
import { detectTyposJaccard } from "./detectTyposJaccard";
import { useMemberStore } from "@/store/memberStore";
import { Alert } from "@/components/ui/alert";
import { CircleCheck, Ban } from "lucide-react";

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
      Alert({
        variant: "destructive",
        children: (
          <div className="flex flex-row justify-start items-start gap-4">
            <Ban className="size-4" />
            <span>엑셀 파일만 업로드 가능합니다. (.xlsx, .xls)</span>
          </div>
        ),
      });
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
      Alert({
        variant: "destructive",
        children: (
          <div className="flex flex-row justify-start items-start gap-4">
            <Ban className="size-4" />
            <div>
              <p>필드명을 정확하게 설정해주세요.</p>
              <ul>
                <li>name</li>
                <li>email</li>
                <li>role</li>
                <li>group</li>
              </ul>
            </div>
          </div>
        ),
      });
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
      Alert({
        variant: "default",
        children: (
          <div className="flex flex-row justify-start items-start gap-4">
            <CircleCheck className="size-4" />
            <span>${result.success_count}명이 등록되었습니다.</span>
          </div>
        ),
      });
    } catch (err) {
      Alert({
        variant: "destructive",
        children: (
          <div className="flex flex-row justify-start items-start gap-4">
            <Ban className="size-4" />
            <span>등록에 실패했습니다.</span>
          </div>
        ),
      });
    }
  };

  return (
    <>
      <Button onClick={handleClick} variant="link" className="text-gray-200">
        회원등록
      </Button>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} ref={inputRef} className="hidden" />
    </>
  );
}
