"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

type ProfileProps = { width: number };

export default function ProfilePage({ width }: ProfileProps) {
  const userName = "이정민이정민이정민이정민";
  const userRole = "Admin";
  const userEmail = "test@gmail.com";
  const userPhone = "010-1234-5678";
  const userGithub = "https://github.com/";
  const userBlog = "https://blog.naver.com/";
  const userGroup = ["정글8기", "307호", "나만무3팀"];

  return (
    <div
      className="flex flex-col h-full w-full gap-4 overflow-auto p-4 bg-background text-foreground scrollbar-thin"
      style={{ flexBasis: "100%" }} // 패널 내부이므로 100%
    >
      {/* 헤더 (프로필과 닫기 버튼) */}
      <div className="flex flex-row w-full">
        <h1 className="flex flex-1 items-center justify-start text-xl font-bold">Profile</h1>
        <button className="flex flex-1 items-center justify-end text-sm">
          <X size={20} />
        </button>
      </div>
      {/* 프로필 이미지 */}
      <div className="flex w-full min-w-0 items-center justify-center">
        <div className="w-1/2 aspect-square bg-gray-200 rounded-2xl overflow-hidden">
          <img src="/user_default.png" alt="user_default" className="w-full h-full object-cover" />
        </div>
      </div>
      {/* 사용자 이름과 역할 */}
      <div className="flex w-full items-end justify-between gap-2">
        <h1 className="flex-1 min-w-0 justify-start text-xl font-bold truncate">{userName}</h1>
        <h1 className="flex-shrink-0 justify-end text-md font-bold text-gray-500">{userRole}</h1>
      </div>
      {/* 메시지 버튼 */}
      <div className="flex w-full min-w-0 items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          className="flex flex-1 min-w-0 items-center justify-start text-md font-bold"
        >
          <Mail size={24} />
          <span className="truncate">Direct Message</span>
        </Button>
      </div>
      {/* 구분선 */}
      <Separator />
      {/* 이메일 */}
      <div className="flex flex-col w-full min-w-0 justify-start gap-1">
        <span className="flex-1 min-w-0 text-md font-bold text-gray-500 truncate">Email address*</span>
        <span className="flex-1 min-w-0 text-md truncate">{userEmail}</span>
      </div>
      {/* 전화번호 */}
      <div className="flex flex-col w-full min-w-0 justify-start gap-1">
        <span className="flex-1 min-w-0 text-md font-bold text-gray-500 truncate">Phone number</span>
        <span className="flex-1 min-w-0 text-md truncate">{userPhone}</span>
      </div>
      {/* github */}
      <div className="flex flex-col w-full min-w-0 justify-start gap-1">
        <span className="flex-1 min-w-0 text-md font-bold text-gray-500 truncate">Github</span>
        <span className="flex-1 min-w-0 text-md truncate">{userGithub}</span>
      </div>
      {/* blog */}
      <div className="flex flex-col w-full min-w-0 justify-start gap-1">
        <span className="flex-1 min-w-0 text-md font-bold text-gray-500 truncate">Blog</span>
        <span className="flex-1 min-w-0 text-md truncate">{userBlog}</span>
      </div>
      {/* 소속 그룹 */}
      <div className="flex flex-col w-full min-w-0 justify-start gap-1">
        <span className="flex-1 min-w-0 text-md font-bold text-gray-500 truncate">Groups</span>
        <div className="flex-1 min-w-0 text-md">
          <ul className="list-disc list-inside pl-1">
            {userGroup.map((group) => (
              <li key={group} className="truncate">
                {group}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
