"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsers, Profile } from "@/apis/userApi";
import { useCreateDM } from "@/hooks/createDM";
import { useProfileStore } from "@/store/profileStore";

export default function SearchAutocomplete() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const createDM = useCreateDM();
  const openProfile = useProfileStore((s) => s.openWithId);

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchUsers(workspaceId, keyword).then((res) => setResults(res));
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, workspaceId]);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/workspaces/${workspaceId}/search?q=${encodeURIComponent(keyword)}`);
    setKeyword("");
    setResults([]);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="pl-7 w-48 bg-gray-700 text-white border-gray-600"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded-md shadow">
          {results.map((u) => (
            <li
              key={u.user_id}
              className="flex justify-between items-center px-2 py-1 hover:bg-gray-100"
            >
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => openProfile(u.user_id)}
              >
                <img
                  src={u.image || "/user_default.png"}
                  className="w-6 h-6 rounded-md bg-gray-400 object-cover"
                />
                <span className="text-sm text-gray-800">{u.nickname}</span>
              </div>
              <Button
                onClick={() => createDM(u.user_id)}
                variant="ghost"
                size="icon"
                className="w-6 h-6"
              >
                <AtSign className="size-4 text-gray-500" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
