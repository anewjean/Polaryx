import { useMemberStore } from "@/store/memberStore";

export function MemberList() {
  const memberList = useMemberStore((state) => state.memberList);

  return (
    <div>
      {memberList.map((member) => (
        <p key={member.email}>
          {member.name} {member.email} {member.role} {member.group}
        </p>
      ))}
    </div>
  );
}
