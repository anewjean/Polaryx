import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { filterUsers } from "./validation";
import { usePathname } from "next/navigation";
import { createUsers } from "@/apis/excelApi";
import { detectTyposJaccard } from "./detectTyposJaccard";
import { useMemberStore } from "@/store/memberStore";
import { toast } from "sonner";
import { CircleCheck, Ban, FileSpreadsheet } from "lucide-react";

export function ExUpload() {
  const workspaceId = usePathname().split("/")[2];
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMemberList } = useMemberStore();

  // Alert 상태 관리
  const [alertInfo, setAlertInfo] = useState<{
    variant: "default" | "destructive";
    message: React.ReactNode;
  } | null>(null);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      toast.error("엑셀 파일만 업로드 가능합니다. (.xlsx, .xls)", {
        icon: <Ban className="size-5" />,
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
    const uploadedHeaders = json[0] as string[];

    ////////////////////////// 동작하지 않는 코드 //////////////////////////
    // const typos = detectTyposJaccard(uploadedHeaders);
    // if (typos.length > 0) {
    //   setAlertInfo({
    //     variant: "destructive",
    //     message: (
    //       <div className="flex flex-row justify-start items-start gap-4">
    //         <Ban className="size-4" />
    //         <div>
    //           <p>필드명을 정확하게 설정해주세요.</p>
    //           <ul>
    //             <li>name</li>
    //             <li>email</li>
    //             <li>role</li>
    //             <li>group</li>
    //           </ul>
    //         </div>
    //       </div>
    //     ),
    //   });
    //   return;
    // }

    // 형식에 맞지 않은 user를 제거
    const { users } = filterUsers(jsonData);
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
      const result = await createUsers(memberList, workspaceId);
      if (result.success_count === 0) {
        toast.error("등록에 실패했습니다", {
          icon: <Ban className="size-5" />,
        });
        return;
      }
      toast.success(`${result.success_count}명이 등록되었습니다`, {
        icon: <CircleCheck className="size-5" />,
      });
    } catch (err) {
      toast.error("등록에 실패했습니다", {
        icon: <Ban className="size-5" />,
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outline"        
      >
        <FileSpreadsheet className="mr-0 h-4 w-4" />
        Import .xlsx
      </Button>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        ref={inputRef}
        className="hidden"
      />
    </>
  );
}
