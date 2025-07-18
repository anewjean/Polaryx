import { create } from 'zustand';

interface LikeState {
  // key: messageId, value: likeCount
  likes: Record<number, number | undefined>;
  // 내가 '좋아요' 누른 메시지 ID들을 저장하는 Set
  myLikes: Set<number>;

  // '좋아요' 토글 액션의 종류를 저장 ('like' 또는 'unlike')
  likeAction: 'like' | 'unlike' | null;

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
  likeAction: null, // 상태 초기화

  setInitialState: (initialLikes, initialMyLikes) => {
    set((state) => ({
      likes: { ...state.likes, ...initialLikes },
      myLikes: new Set([...state.myLikes, ...initialMyLikes]),
    }));
  },

  setLikeCount: (messageId, count) => set((state) => ({
    likes: { ...state.likes, [messageId]: count },
  })),
  
  // '좋아요' 버튼이 호출할 메인 함수 수정
  toggleLike: (messageId, userId) => {
    const myLikes = new Set(get().myLikes);
    const currentLikes = get().likes;
    let likeCount = currentLikes[messageId] || 0;
    let action: 'like' | 'unlike'; // 액션을 저장할 변수

    if (myLikes.has(messageId)) {
      myLikes.delete(messageId);
      likeCount--;
      action = 'unlike'; // '좋아요 취소' 액션
    } else {
      myLikes.add(messageId);
      likeCount++;
      action = 'like'; // '좋아요 추가' 액션
    }

    // 변경된 UI 상태와 함께, 웹소켓 전송에 필요한 정보들을 설정
    set({
      myLikes,
      likes: { ...currentLikes, [messageId]: Math.max(0, likeCount) },
      sendFlag: true,
      messageIdToSend: messageId,
      userIdToSend: userId,
      likeAction: action, // 어떤 액션이었는지 스토어에 저장
    });
  },
  
  // --- 웹소켓 전송을 위한 상태 ---
  sendFlag: false,
  messageIdToSend: null,
  userIdToSend: null,
  // 전송 후, 모든 관련 상태를 리셋
  resetSendFlag: () => set({
    sendFlag: false,
    messageIdToSend: null,
    userIdToSend: null,
    likeAction: null, // likeAction도 함께 리셋
  }),
}));
