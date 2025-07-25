"use client"

import { SquareUserRound, KeyRound, UsersRound } from "lucide-react"
import { usePathname, useParams, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminHeader() { 
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  // 현재 활성화된 탭 확인
  const getActiveTab = () => {
    if (pathname.includes('users')) return 'users';
    if (pathname.includes('groups')) return 'groups';
    if (pathname.includes('roles')) return 'roles';
    return 'users';
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    router.push(`/workspaces/${workspaceId}/admin/${value}`);
  };

  return (    
    <div className="sticky top-0 bg-white shadow-sm">        
      <div className="flex items-center h-[50px] px-[17px]">
        <div className="flex flex-1 justify-between items-center h-[30px] px-[3px]">
          <div className="flex items-center">                
            <p className="text-l">Administration</p>
          </div>
        </div>
      </div>
      
      <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="users">
            <SquareUserRound />
            <p>Members</p>
          </TabsTrigger>
          <TabsTrigger value="groups">
            <UsersRound />
            <p>Groups</p>
          </TabsTrigger>
          <TabsTrigger value="roles">
            <KeyRound />
            <p>Roles</p>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
