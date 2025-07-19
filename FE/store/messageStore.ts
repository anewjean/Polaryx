import { ms } from "date-fns/locale";
import { create } from "zustand";

interface Message {
  tabId: number;
  senderId: string;
  msgId: number | undefined;
  nickname: string;
  image: string;
  content: string;
  createdAt: string | undefined;
  fileUrl: string | null;
  isUpdated: number;
  checkCnt: number;
  prayCnt: number;
  sparkleCnt: number;
  clapCnt: number;
  likeCnt: number;
  myToggle: Record<string, boolean>;
}

interface MessageStore {
  // 메시지 입력
  message: string;
  setMessage: (msg: string) => void;

  // 수정 버튼 누르면 수정 모드로 변경
  updateMessage: (msgId: number, msg: string) => void;

  // 메시지 삭제
  deleteMessage: (id: number) => void;

  // 메시지 전송 trigger
  sendFlag: boolean;
  sendEmojiFlag: boolean;
  setSendFlag: (flag: boolean) => void;
  setSendEmojiFlag: (flag: boolean) => void;
  // 메시지 저장
  messages: Message[];
  setMessages: (msg: Message[]) => void;
  appendMessage: (msg: Message) => void;
  prependMessages: (msg: Message[]) => void;

  // file url 저장
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;

  updateUserProfile: (
    userId: string,
    updates: { nickname?: string; image?: string },
  ) => void;

  // 새 메시지 실시간 알림
  unreadCounts: Record<number, number>;
  incrementUnread: (tabId: number) => void;
  clearUnread: (tabId: number) => void;

  // 탭 초대 실시간 알림
  invitedTabs: number[];
  addInvitedTab: (tabId: number) => void;
  clearInvitedTab: (tabId: number) => void;


  // 좋아요 실시간 전파
  // 웹소켓에서 브로드캐스트된 like_count를 설정하는 함수
  setEmojiCount: (messageId: number, count: number) => void;

  // '좋아요' 버튼 클릭 시 UI가 호출할 단 하나의 함수
  toggleEmoji: (messageId: number, userId: string, emojiType: string) => void;

}

export const useMessageStore = create<MessageStore>((set, get) => ({
  message: "",
  setMessage: (msg) => set({ message: msg }),

  // 수정 버튼 누르면 수정 모드로 변경
  updateMessage: (msgId, msg) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.msgId === msgId ? { ...m, content: msg } : m,
      ),
    })), // hack : 오류 발생할 수 있음

  // 메시지 삭제
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.msgId !== id),
    })),

  // 메시지 전송 trigger
  sendFlag: false,
  setSendFlag: (flag) => set({ sendFlag: flag }),

  // List에 메시지 추가
  messages: [],
  setMessages: (msg) => set({ messages: msg }),
  appendMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  prependMessages: (msgs) =>
    set((state) => {
      // msgId를 기준으로 중복 제거
      const uniqueMessages = msgs.filter(
        (newMsg) =>
          !state.messages.some(
            (existingMsg) => existingMsg.msgId === newMsg.msgId,
          ),
      );

      return {
        messages: [...uniqueMessages, ...state.messages],
      };
    }),

  // file url 저장
  fileUrl: null,
  setFileUrl: (url) => set({ fileUrl: url }),

  updateUserProfile: (userId, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.senderId === userId
          ? {
              ...msg,
              ...(updates.nickname && { nickname: updates.nickname }),
              ...(updates.image && { image: updates.image }),
            }
          : msg,
      ),
    }));
  },
  // 새 메시지 실시간 알림
  unreadCounts: {},

  incrementUnread: (tabId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [tabId]: (state.unreadCounts[tabId] || 0) + 1,
      },
    })),

  clearUnread: (tabId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [tabId]: 0,
      },
    })),

  // 탭 초대 실시간 알림
  invitedTabs: [],
  addInvitedTab: (tabId) =>
    set((state) => ({
      invitedTabs: state.invitedTabs.includes(tabId)
        ? state.invitedTabs
        : [...state.invitedTabs, tabId],
    })),

  clearInvitedTab: (tabId) =>
    set((state) => ({
      invitedTabs: state.invitedTabs.filter((id) => id !== tabId),
    })),
  // 전송 후, 모든 관련 상태를 리셋
  sendEmojiFlag: false,
  setSendEmojiFlag: (flag) => set({ sendEmojiFlag: flag }),

  setEmojiCount: (messageId, count) => set((state) => ({
  })),

  // '좋아요' 버튼이 호출할 메인 함수 수정
  toggleEmoji: (messageId, userId, emojiType) => {
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
  }
}));

