"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Profile } from "@/apis/profileApi";
import { userColumns as defaultUserColumns } from "../../app/workspaces/[workspaceId]/admin/users/columns";
import { getUsers } from "@/apis/userApi";
import { useRouter } from "next/navigation";

interface UserTableProps {
  onUsersLoaded?: (count: number) => void;
  onRefreshNeeded?: () => void;
  userColumns?: ColumnDef<Profile>[];
}

export function UserTable({ onUsersLoaded, onRefreshNeeded, userColumns }: UserTableProps = {}) {
  const params = useParams();
  const workspaceId = params.workspaceId;

  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 목록 불러오기 함수
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const users = await getUsers(workspaceId as string);
      setUsers(users);
      setIsLoading(false);
      
      // 사용자 수를 외부로 전달
      if (onUsersLoaded) {
        onUsersLoaded(users.length);
      }
    } catch (error) {
      console.error("유저 조회에 실패했습니다.", error);
      setIsLoading(false);
    }
  };

  // 사용자 목록을 새로고칠 때 외부 함수도 호출
  const refreshData = async () => {
    await fetchUsers();
    // 외부에서 전달받은 새로고침 함수가 있다면 호출
    if (onRefreshNeeded) {
      onRefreshNeeded();
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 불러오기
  useEffect(() => {
    refreshData();
  }, [workspaceId]);

  const data = users;

  const table = useReactTable({
    data,
    columns: userColumns || defaultUserColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>로딩중...</p>
      </div>
    );
  }

  // 테이블 레이아웃 고정을 위한 스타일 계산
  const columnSizes: Record<string, number> = {};
  table.getHeaderGroups()[0].headers.forEach((header) => {
    columnSizes[header.id] = header.getSize();
  });

  return (
    <div className="flex flex-1 flex-col h-full w-full overflow-hidden rounded-md border">      
      {/* 테이블 헤더 - 스크롤 영역 밖에 배치 */}
      <div className="w-full">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="h-12 px-4 text-left align-middle text-sm font-semibold text-gray-700 border-b"
                  style={{ width: `${header.getSize()}px` }}
                >
                  <div
                    className="truncate"
                    title={header.column.columnDef.header?.toString()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* 테이블 본문 - 스크롤 영역 내에 배치 */}
      <div className="overflow-auto w-full h-fit scrollbar-thin">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="items-center p-4 align-middle border-b border-gray-100 text-sm"
                      style={{ width: `${columnSizes[cell.column.id]}px` }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={(userColumns || defaultUserColumns).length} className="h-24 text-center">
                  회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
