"use client";

import { useState } from "react";
import { RoleTable } from "@/components/Administration/RoleTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RoleTablePage() {
  const [roleCount, setRoleCount] = useState<number>(0);

  const handleRolesLoaded = (count: number) => {
    setRoleCount(count);
  };

  return (
    <div className="flex flex-1 w-full h-full flex-col gap-2">  
      <div className="flex justify-between items-center">        
        <p className="text-md">{roleCount} Role(s)</p>
        <div className="flex gap-2">
          <Button variant="outline"><Plus className="mr-0 h-4 w-4" />New Role</Button>                    
        </div>
      </div>
      <div className="flex flex-1 overflow-y-auto scrollbar-thin">
        <RoleTable onRolesLoaded={handleRolesLoaded} />
      </div>
    </div>
  );
}