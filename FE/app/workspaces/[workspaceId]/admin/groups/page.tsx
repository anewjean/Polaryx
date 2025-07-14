"use client";

import { useState } from "react";
import { GroupTable } from "@/components/Administration/GroupTable";
import { Button } from "@/components/ui/button";
import { ExUpload } from "@/components/excel_import/exImportButton";
import { Plus } from "lucide-react";

export default function GroupTablePage() {
  const [groupCount, setGroupCount] = useState<number>(0);

  const handleGroupsLoaded = (count: number) => {
    setGroupCount(count);
  };

  return (
    <div className="flex flex-1 w-full h-full flex-col gap-2">  
      <div className="flex justify-between items-center">        
        <p className="text-md">{groupCount} Group(s)</p>
        <div className="flex gap-2">
          <Button variant="outline"><Plus className="mr-0 h-4 w-4" />New Group</Button>                    
        </div>
      </div>
      <div className="flex flex-1 overflow-y-auto scrollbar-thin">
        <GroupTable onGroupsLoaded={handleGroupsLoaded} />
      </div>
    </div>
  );
}