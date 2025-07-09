import { ms } from "date-fns/locale";
import { create } from "zustand";

interface Message {
  senderId: Buffer;
  msgId: number | undefined;
  nickname: string;
  image: string;
  content: string;
  createdAt: string | undefined;
  fileUrl: string | null;
}

interface MessageStore {
  // 메시지 입력
  message: string;
  setMessage: (msg: string) => void;

  // 수정 버튼 누르면 수정 모드로 변경
  updateMessage: (idx: number, msg: Message) => void;

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
}

export const useMessageStore = create<MessageStore>((set) => ({
  message: "",
  setMessage: (msg) => set({ message: msg }),

  // 수정 버튼 누르면 수정 모드로 변경
  updateMessage: (idx, msg) =>
    set((state) => ({
      messages: state.messages.map((m, i) => (i === idx ? msg : m)),
    })),


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
  appendMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  prependMessages: (msgs) => set((state) => ({
    messages: [...msgs, ...state.messages],
  })),

  // file url 저장
  fileUrl: null,
  setFileUrl: (url) => set({ fileUrl: url }),
}));
