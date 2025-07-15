"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GroupTable } from "@/components/Administration/GroupTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateGroupDialog } from "@/components/Administration/GroupActions/CreateGroupDialog";
import { useGroupStore } from "@/store/groupStore";

export default function GroupTablePage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  const [groupCount, setGroupCount] = useState<number>(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 전역 상태에서 그룹 데이터 가져오기
  const { fetchGroups, refreshTrigger: globalRefreshTrigger } = useGroupStore();

  const handleGroupsLoaded = (count: number) => {
    setGroupCount(count);
  };
  
  // 그룹 목록 새로고침 함수
  const handleRefresh = () => {
    // 전역 상태의 새로고침 트리거 업데이트
    useGroupStore.getState().triggerRefresh();
  };

  return (
    <div className="flex flex-1 w-full h-full flex-col gap-2">  
      <div className="flex justify-between items-center">        
        <p className="text-md">{groupCount}개의 그룹</p>
        <div className="flex gap-2">
          <CreateGroupDialog 
            isOpen={isCreateDialogOpen}
            setIsOpen={setIsCreateDialogOpen}
            onCreateSuccess={handleRefresh}
            trigger={
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />새 그룹 만들기
              </Button>
            }
          />                   
        </div>
      </div>
      <div className="flex flex-1 mx-1 overflow-y-auto scrollbar-thin">
        <GroupTable 
          onGroupsLoaded={handleGroupsLoaded} 
          key={globalRefreshTrigger} 
          onRefreshNeeded={handleRefresh}
        />
      </div>
    </div>
  );
}