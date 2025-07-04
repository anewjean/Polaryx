"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { SquarePen } from "lucide-react";
import { CardModal } from "@/components/modal/CardModal";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profileStore";
import { getProfile, patchProfile, Profile } from "@/apis/profileApi";
import { CardFooter } from "@/components/ui/card";

type ProfileProps = {
  targetId?: string;
};

export default function ProfilePage({ targetId }: ProfileProps) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  // accessToken의 sub 클레임에 있는 userId 추출
  const { user_id: userId } = jwtDecode<{ user_id: string }>(accessToken);

  // 프로필 닫기 시 실행할 함수형 변수 선언
  const close = useProfileStore((s) => s.setClose);

  // 프로필 데이터 상태 관리
  const [profile, setProfile] = useState<Profile | null>(null);

  // 프로필 편집 폼 데이터 상태 관리
  const [form, setForm] = useState<{
    nickname: string;
    phone?: string;
    github?: string;
    blog?: string;
  }>({ nickname: "" });

  // 프로필 조회 중 상태 관리
  const [loading, setLoading] = useState(true);

  // 프로필 저장 중 상태 관리
  const [saving, setSaving] = useState(false);

  // 프로필 조회 (페이지 렌더 후 바로 실행 (userId 변경 시 재 실행))
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let profileData: Profile;
        if (targetId) {
          profileData = await getProfile(targetId);

          // targetId가 없으면 본인 프로필 조회
        } else {
          profileData = await getProfile(userId);
        }
        setProfile(profileData);
        setForm({
          nickname: profileData.nickname,
          phone: profileData.phone ?? "",
          github: profileData.github ?? "",
          blog: profileData.blog ?? "",
        });
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [targetId]);

  // 프로필 수정
  const saveChange = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      let updatedProfile: Profile;
      updatedProfile = await patchProfile(userId, form);
      setProfile(updatedProfile);
      close();
    } catch (error) {
      console.error(error);
      alert("프로필 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  
  return (
    <div
      className="h-full w-full overflow-auto p-4 bg-background text-foreground"
      style={{ flexBasis: "100%" }} // 패널 내부이므로 100%
    >
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      {/* 실제 프로필 내용 */}
    </div>
  );
}
