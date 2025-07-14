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
import { Role } from "@/apis/roleApi";
import { roleColumns } from "../../app/workspaces/[workspaceId]/admin/roles/columns";
import { getRoles } from "@/apis/roleApi";
import { useRouter } from "next/navigation";

interface RoleTableProps {
  onRolesLoaded?: (count: number) => void;
}

export function RoleTable({ onRolesLoaded }: RoleTableProps = {}) {
  const params = useParams();
  const workspaceId = params.workspaceId;

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const roles = await getRoles(workspaceId as string);
        setRoles(roles);
        setIsLoading(false);
        
        // 역할 수를 외부로 전달
        if (onRolesLoaded) {
          onRolesLoaded(roles.length);
        }
      } catch (error) {
        console.error("역할 조회에 실패했습니다.", error);
        setIsLoading(false);
      }
    };
    fetchRoles();
  }, [workspaceId, onRolesLoaded]);

  const data = roles;

  const table = useReactTable({
    data,
    columns: roleColumns,
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
