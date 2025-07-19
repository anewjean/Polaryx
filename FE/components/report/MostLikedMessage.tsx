"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ChartNoAxesColumn } from "lucide-react";
import { ChatProfile } from "../chat/ChatProfile";

// 더미 데이터
const dummyLikedMessages = [
  { senderId: 'user1', msgId: 101, imgSrc: 'https://i.pravatar.cc/40?u=user1', nickname: '에밀리', time: '오후 2:30', content: '이번 분기 실적 정말 대단해요! 모두 고생 많으셨습니다. 🎉', showProfile: true, fileUrl: null, isUpdated: 0, likes: 152 },
  { senderId: 'user2', msgId: 102, imgSrc: 'https://i.pravatar.cc/40?u=user2', nickname: '데이빗', time: '오전 10:15', content: '새로운 기능 아이디어 정말 좋은데요? 바로 적용해봐도 될 것 같아요.', showProfile: true, fileUrl: null, isUpdated: 1, likes: 128 },
  { senderId: 'user3', msgId: 103, imgSrc: 'https://i.pravatar.cc/40?u=user3', nickname: '사라', time: '어제', content: '어제 회식 정말 즐거웠습니다! 다음에도 이런 자리 자주 있었으면 좋겠어요.', showProfile: true, fileUrl: null, isUpdated: 0, likes: 98 },
  { senderId: 'user4', msgId: 104, imgSrc: 'https://i.pravatar.cc/40?u=user4', nickname: '마이클', time: '3일 전', content: '프로젝트 마감일이 얼마 남지 않았네요. 다들 조금만 더 힘내봅시다!', showProfile: true, fileUrl: null, isUpdated: 0, likes: 85 },
  { senderId: 'user5', msgId: 105, imgSrc: 'https://i.pravatar.cc/40?u=user5', nickname: '제시카', time: '지난 주', content: '고양이 사진입니다. 힐링하고 가세요. 🐈', showProfile: true, fileUrl: 'https://placekitten.com/300/200', isUpdated: 0, likes: 77 },
  { senderId: 'user6', msgId: 106, imgSrc: 'https://i.pravatar.cc/40?u=user6', nickname: '크리스', time: '2주 전', content: '도와주신 덕분에 문제 잘 해결했습니다. 정말 감사합니다!', showProfile: true, fileUrl: null, isUpdated: 0, likes: 65 },
  { senderId: 'user7', msgId: 107, imgSrc: 'https://i.pravatar.cc/40?u=user7', nickname: '아만다', time: '한 달 전', content: '다음 주 워크샵 장소 투표합니다. 의견 주세요.', showProfile: true, fileUrl: null, isUpdated: 0, likes: 51 },
  { senderId: 'user8', msgId: 108, imgSrc: 'https://i.pravatar.cc/40?u=user8', nickname: '제임스', time: '한 달 전', content: '새로운 커피 머신 정말 좋네요. 다들 한번 써보세요.', showProfile: true, fileUrl: null, isUpdated: 0, likes: 48 },
  { senderId: 'user9', msgId: 109, imgSrc: 'https://i.pravatar.cc/40?u=user9', nickname: '린다', time: '두 달 전', content: '혹시 이 문제에 대해 아시는 분 계신가요?', showProfile: true, fileUrl: null, isUpdated: 0, likes: 32 },
  { senderId: 'user10', msgId: 110, imgSrc: 'https://i.pravatar.cc/40?u=user10', nickname: '로버트', time: '두 달 전', content: '주말 잘 보내세요~', showProfile: true, fileUrl: null, isUpdated: 0, likes: 25 },
];

export function MostLikedMessage() {
    return (
        <Card className="pt-8">
            {/* 차트 제목 */}
            <CardHeader className="flex items-center gap-2 space-y-0 border-b">
                <div className="grid flex-1 gap-1">
                    <CardTitle className="text-lg">Most Liked Message</CardTitle>
                    <CardDescription>
                        Top 10 messages got most likes
                    </CardDescription>
                </div>
            </CardHeader>
            {/* 차트 내용 */}
            <CardContent>
                <div className="flex flex-col gap-2 py-2">
                    {dummyLikedMessages.map((msg) => (
                        <div key={msg.msgId} className="flex items-center justify-between bg-muted hover:bg-gray-200 rounded-lg pr-6">
                            <div className="flex-grow">
                                {/* 메시지 */}
                                <ChatProfile
                                    senderId={msg.senderId}
                                    msgId={msg.msgId}
                                    imgSrc={msg.imgSrc}
                                    nickname={msg.nickname}
                                    time={msg.time}
                                    content={msg.content}
                                    showProfile={msg.showProfile}
                                    fileUrl={msg.fileUrl}
                                    isUpdated={msg.isUpdated}
                                    className="hover:bg-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-red-500">♥</span>
                                <span className="font-semibold text-foreground">{msg.likes}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            {/* 차트 하단 */}
            <CardFooter className="flex-col items-start gap-2 text-sm">                
                <div className="flex gap-1 text-muted-foreground leading-none">
                    <ChartNoAxesColumn className="h-4 w-4" />
                    Showing Messages since the tab created
                </div>
            </CardFooter>
        </Card>
    );
}