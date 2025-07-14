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
  setSendFlag: (flag: boolean) => void;

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
    set((state) => ({
      messages: [...msgs, ...state.messages],
    })),

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
}));
