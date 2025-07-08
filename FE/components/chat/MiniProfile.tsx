import { HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { sendDirectMessage } from "@/apis/messageApi";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface MiniProfileProps {
  senderId: Buffer;
  imgSrc: string;
  nickname: string;
}

export function MiniProfile({ senderId, imgSrc, nickname }: MiniProfileProps) {
  // URL에서 workspaceId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // 라우터
  const router = useRouter();

  // 프로필
  const openProfile = useProfileStore((s) => s.setOpen);

  // DM 생성 이벤트 핸들러
  const createDM = async (userIds: string[]) => {
    try {
      const res = await sendDirectMessage(workspaceId, userIds);
      console.log("DM 생성 응답:", res);
      router.replace(`/workspaces/${workspaceId}/tabs/${res.tab_id}`);
    } catch (error) {
      console.error("DM 생성 중 오류:", error);
    }
  };

  return (
    <div>
      <HoverCardContent side="top" className="flex items-center HoverCardContent">
        <div>
          <img src={imgSrc} className="w-[60px] h-[60px] rounded-lg bg-gray-400 mr-3 object-cover" />
        </div>
        <div>
          <div className="ml-0.5 text-m-bold">{nickname}</div>
          <div className="mt-1.5">
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => {
                createDM([senderId.toString()]);
              }}
            >
              <div className="text-s-bold">DM</div>
            </Button>
            <Button onClick={openProfile} className="ml-1 cursor-pointer" variant="outline" size="sm">
              <div className="text-s-bold">프로필</div>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </div>
  );
}
