"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { roleColumns } from "../../app/workspaces/[workspaceId]/admin/roles/columns";
import { useRoleStore } from "@/store/roleStore";

interface RoleTableProps {
  onRolesLoaded?: (count: number) => void;
  onRefreshNeeded?: () => void;
}

export function RoleTable({ onRolesLoaded, onRefreshNeeded }: RoleTableProps = {}) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // 전역 상태에서 역할 데이터 가져오기
  const { roles, loadingRoles, fetchRoles } = useRoleStore();

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    // 역할 데이터 불러오기
    fetchRoles(workspaceId);
  }, [workspaceId, fetchRoles]);

  // 역할 수를 외부로 전달
  useEffect(() => {
    if (onRolesLoaded && roles.length > 0) {
      onRolesLoaded(roles.length);
    }
  }, [roles, onRolesLoaded]);  

  const data = roles;

  const table = useReactTable({
    data,
    columns: roleColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loadingRoles && roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-24">
        <p>역할 정보를 불러오는 중...</p>
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
            {table.getRowModel().rows.map((row) => (
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
            ))}          
          </tbody>
        </table>
      </div>
    </div>
  );
}
