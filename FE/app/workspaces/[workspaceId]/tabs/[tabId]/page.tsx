"use client";

import { TabMembers } from "@/components/tab/TabMembers";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMemberList, getPossibleMemberList } from "@/apis/tabApi";
import { Member } from "@/apis/tabApi";

export default function TabPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  const [tabMembers, setTabMembers] = useState<Member[]>([]);
  const [possibleMembers, setPossibleMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (workspaceId && tabId) {
      const fetchData = async () => {
        setTabMembers(await getMemberList(workspaceId, tabId));
        setPossibleMembers(await getPossibleMemberList(workspaceId, tabId));
      };
      fetchData();
    }
  }, [workspaceId, tabId]);

  return (
    <div className="flex flex-col p-10 gap-5">
      <h1>탭영역</h1>
      <TabMembers />
      <h2>참여 인원</h2>
      <ul>
        {tabMembers.map((member) => (
          <li key={member.user_id}>
            {member?.image}
            {member?.nickname}
            {member?.role}
            {member?.groups}
          </li>
        ))}
      </ul>
      <h2>참여 가능 인원</h2>
      <ul>
        {possibleMembers.map((member) => (
          <li key={member.user_id}>
            {member?.image}
            {member?.nickname}
            {member?.role}
            {member?.groups}
          </li>
        ))}
      </ul>
    </div>
  );
}
