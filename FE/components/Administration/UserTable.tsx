"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Profile } from "@/apis/profileApi";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { userColumns as defaultUserColumns } from "../../app/workspaces/[workspaceId]/admin/users/columns";

interface UserTableProps {
  onUsersLoaded?: (count: number) => void;
  userColumns?: ColumnDef<Profile>[];
  onRefreshNeeded?: () => void;
}

export function UserTable({ onUsersLoaded, userColumns, onRefreshNeeded }: UserTableProps = {}) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // userStore에서 상태와 함수 가져오기
  const { users: storeUsers, loadingUsers, fetchUsers: fetchUsersFromStore, triggerRefresh } = useUserStore();
  
  // 로컬 상태 (필요한 경우)
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 목록 업데이트 (스토어 데이터 -> 로컬 상태)
  useEffect(() => {
    if (storeUsers && storeUsers[workspaceId]) {
      setUsers(storeUsers[workspaceId]);
      if (onUsersLoaded) {
        onUsersLoaded(storeUsers[workspaceId].length);
      }
    }
  }, [storeUsers, workspaceId, onUsersLoaded]);

  // 사용자 목록 불러오기 함수
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      await fetchUsersFromStore(workspaceId);
      setIsLoading(false);
    } catch (error) {
      console.error("유저 조회에 실패했습니다.", error);
      setIsLoading(false);
    }
  };

  // 사용자 목록을 새로고침하는 함수
  const refreshData = async () => {
    await loadUsers();
    if (onRefreshNeeded) {
      onRefreshNeeded();
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 불러오기
  useEffect(() => { 
    refreshData(); 
  }, [workspaceId]); // eslint-disable-line react-hooks/exhaustive-deps

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
