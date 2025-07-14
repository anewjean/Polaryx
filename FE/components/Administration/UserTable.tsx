"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Profile } from "@/apis/profileApi";
import { userColumns as defaultUserColumns } from "../../app/workspaces/[workspaceId]/admin/users/columns";
import { getUsers } from "@/apis/userApi";

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
      if (onUsersLoaded) { onUsersLoaded(users.length); }
    } catch (error) {
      console.error("유저 조회에 실패했습니다.", error);
      setIsLoading(false);
    }
  };

  // 사용자 목록을 새로고칠 때 외부 함수도 호출
  const refreshData = async () => {
    await fetchUsers();
    // 외부에서 전달받은 새로고침 함수가 있다면 호출
    if (onRefreshNeeded) { onRefreshNeeded(); }
  };

  // 컴포넌트 마운트 시 사용자 목록 불러오기
  useEffect(() => { refreshData(); }, [workspaceId]);

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

  // 테이블 레이아웃 계산을 위한 스타일 설정
  const columnSizes: Record<string, string> = {};
  
  // 모든 컬럼의 size 합계 계산
  const totalSize = table.getHeaderGroups()[0].headers.reduce(
    (sum, header) => sum + (header.column.columnDef.size || 0), 0
  );
  
  // 각 컬럼의 상대적 비율 계산
  table.getHeaderGroups()[0].headers.forEach((header) => {
    // 컬럼 정의에서 직접 size 값을 가져와서 비율 계산
    const size = header.column.columnDef.size || 0;
    columnSizes[header.id] = `${(size / totalSize) * 100}%`;
  });

  return (
    <div className="flex flex-1 flex-col h-full w-full overflow-hidden rounded-md border">      
      {/* 테이블 헤더와 본문을 하나의 테이블로 구성 */}
      <div className="w-full overflow-x-auto overflow-y-auto scrollbar-thin">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed', minWidth: '1000px' }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="h-12 px-4 text-left align-middle text-sm font-semibold text-gray-700 border-b"
                  style={{ width: columnSizes[header.id] }}
                >
                  <div
                    className="flex items-center justify-start truncate"
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
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-4 align-middle border-b border-gray-100 text-sm"
                      style={{ width: columnSizes[cell.column.id] }}
                    >
                      <div className="flex items-center justify-start w-full overflow-hidden">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
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
