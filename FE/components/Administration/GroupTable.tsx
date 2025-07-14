"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useGroupStore } from "@/store/groupStore";
import { groupColumns } from "../../app/workspaces/[workspaceId]/admin/groups/columns";

interface GroupTableProps {
  onGroupsLoaded?: (count: number) => void;
}

export function GroupTable({ onGroupsLoaded }: GroupTableProps = {}) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // Zustand 스토어에서 그룹 데이터 가져오기
  const { groups, loadingGroups, fetchGroups } = useGroupStore();

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    // 그룹 데이터 불러오기
    fetchGroups(workspaceId);
  }, [workspaceId, fetchGroups]);

  // 그룹 수를 외부로 전달
  useEffect(() => {
    if (onGroupsLoaded && groups.length > 0) {
      onGroupsLoaded(groups.length);
    }
  }, [groups, onGroupsLoaded]);
  
  // 외부에서 새로고침 요청 시 호출될 함수
  const handleRefresh = () => {
    fetchGroups(workspaceId);
  };

  const data = groups;

  const table = useReactTable({
    data,
    columns: groupColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  // 액션 메뉴에 새로고침 함수 전달을 위한 컨텍스트 설정
  const tableContextWithRefresh = {
    table,
    onRefresh: handleRefresh
  };

  if (loadingGroups && groups.length === 0) {
    return (
      <div className="flex items-center justify-center h-24">
        <p>그룹 정보를 불러오는 중...</p>
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
            {table.getRowModel().rows.map((row) => (
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
            ))}          
          </tbody>
        </table>
      </div>
    </div>
  );
}
