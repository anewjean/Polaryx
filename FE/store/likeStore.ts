import { create } from 'zustand';

interface LikeState {
  // key: messageId, value: likeCount
  likes: Record<number, number | undefined>;
  // 내가 '좋아요' 누른 메시지 ID들을 저장하는 Set
  myLikes: Set<number>;

  // API 로딩 시 초기 상태를 한 번에 설정하는 함수
  setInitialState: (
    initialLikes: Record<number, number>,
    initialMyLikes: number[]
  ) => void;

  // 웹소켓에서 브로드캐스트된 like_count를 설정하는 함수
  setLikeCount: (messageId: number, count: number) => void;

  // '좋아요' 버튼 클릭 시 UI가 호출할 단 하나의 함수
  toggleLike: (messageId: number, userId: string) => void;

  // 웹소켓 클라이언트가 데이터 전송에 사용할 상태들
  sendFlag: boolean;
  messageIdToSend: number | null;
  userIdToSend: string | null;
  resetSendFlag: () => void;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likes: {},
  myLikes: new Set(),

  setInitialState: (initialLikes, initialMyLikes) => {
    set((state) => ({
      likes: { ...state.likes, ...initialLikes },
      myLikes: new Set([...state.myLikes, ...initialMyLikes]),
    }));
  },

  setLikeCount: (messageId, count) => set((state) => ({
    likes: { ...state.likes, [messageId]: count },
  })),
  
  // '좋아요' 버튼이 호출할 메인 함수
  toggleLike: (messageId, userId) => {
    // 1. 현재 상태를 가져와서 UI를 즉시 업데이트 (Optimistic Update)
    const myLikes = new Set(get().myLikes);
    const currentLikes = get().likes;
    let likeCount = currentLikes[messageId] || 0;

    if (myLikes.has(messageId)) {
      myLikes.delete(messageId); // 내 좋아요 목록에서 제거
      likeCount--;
    } else {
      myLikes.add(messageId); // 내 좋아요 목록에 추가
      likeCount++;
    }

    // 2. 변경된 UI 상태와 함께, 웹소켓 전송을 요청하는 플래그를 true로 설정
    set({
      myLikes,
      likes: { ...currentLikes, [messageId]: Math.max(0, likeCount) },
      sendFlag: true,
      messageIdToSend: messageId,
      userIdToSend: userId,
    });
  },
  
  // --- 웹소켓 전송을 위한 상태 ---
  sendFlag: false,
  messageIdToSend: null,
  userIdToSend: null,
  resetSendFlag: () => set({
    sendFlag: false,
    messageIdToSend: null,
    userIdToSend: null,
  }),
}));
