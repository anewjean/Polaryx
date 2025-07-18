import { create } from 'zustand';

interface LikeState {
  // key: messageId, value: likeCount
  likes: Record<number, number | undefined>;
  // 내가 좋아요 누른 메시지 ID들을 저장하는 Set
  myLikes: Set<number>;
  // API 로딩 시 초기 상태를 설정하는 함수
  setInitialState: (
    initialLikes: Record<number, number>,
    initialMyLikes: number[]
  ) => void;
  // 웹소켓에서 브로드캐스트된 like_count를 설정하는 함수
  setLikeCount: (messageId: number, count: number) => void;
  // 좋아요 버튼 클릭 시 클라이언트에서 먼저 상태를 바꾸는 함수 (Optimistic Update)
  toggleMyLike: (messageId: number) => void;
  // 웹소켓으로 좋아요 이벤트를 보낼 함수
  sendLike: ((messageId: number, userId: string) => void) | null;
  // 웹소켓 클라이언트가 sendLike 함수를 스토어에 등록하기 위한 함수
  setSendLike: (fn: ((messageId: number, userId: string) => void) | null) => void;
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
  toggleMyLike: (messageId) => {
    const myLikes = new Set(get().myLikes);
    const currentLikes = get().likes;
    let likeCount = currentLikes[messageId] || 0;

    if (myLikes.has(messageId)) {
      myLikes.delete(messageId);
      likeCount--;
    } else {
      myLikes.add(messageId);
      likeCount++;
    }

    set({
      myLikes,
      likes: { ...currentLikes, [messageId]: Math.max(0, likeCount) },
    });
  },
  sendLike: null,
  setSendLike: (fn) => set({ sendLike: fn }),
})); 