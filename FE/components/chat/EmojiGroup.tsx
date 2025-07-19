"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useMessageStore } from '@/store/messageStore';

interface EmojiGroupMenuProps {
  msgId: number;
  userId: string;
  onClose: () => void;
}

interface EmojiGroupProps {
  msgId: number;
  userId: string;
  onClose: () => void;
  checkCnt: number;
  clapCnt: number;
  prayCnt: number;
  sparkleCnt: number;
  likeCnt: number;
  myToggle: Record<string, boolean>;  
}

const emojis = ['✅', '🙏', '✨', '👏', '❤️'];

// 이모지를 myToggle 키명으로 변환 (내 선택 상태용)
const emojiToggleMap: Record<string, string> = {
  '✅': 'check',
  '🙏': 'pray', 
  '✨': 'sparkle',
  '👏': 'clap',
  '❤️': 'like'
};

export function EmojiGroupMenu({ msgId, userId, onClose }: EmojiGroupMenuProps) {

  // 클릭된 이모지 상태 관리
  const [pressedEmoji, setPressedEmoji] = useState<string | null>(null);

  // 이모지 버튼 클릭 시 동작할 함수
  const toggleEmoji = useMessageStore((state) => state.toggleEmoji);
  const setTargetEmoji = useMessageStore((state) => state.setTargetEmoji);
  const setAction = useMessageStore((state) => state.setAction);

  // 현재 메시지 정보 가져오기
  const currentMessage = useMessageStore((state) => 
    state.messages.find(msg => msg.msgId === msgId)
  );

  const handleEmojiClick = (e: React.MouseEvent<HTMLButtonElement>, emoji: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.right) / 2 / window.innerWidth,
      y: (rect.top + rect.bottom) / 2 / window.innerHeight,
    };

    // 폭죽 애니메이션 조절부
    confetti({
      origin: origin,
      particleCount: 300,
      spread: 150,
      angle: 90,
      scalar: 0.9,
      ticks: 200,
      gravity: 1,
      decay: 0.94,
      startVelocity: 35,
    });    
    
    setTimeout(() => {
      onClose();
    }, 200); // 애니메이션이 시작될 수 있도록 약간의 지연을 줍니다.
    
    // 이모지 선택 유무 확인
    const toggleKey = emojiToggleMap[emoji];   
    
    // 현재 사용자가 이 이모지를 이미 눌렀는지 확인 (myToggle 키 사용)
    const isAlreadyToggled = currentMessage?.myToggle?.[toggleKey] || false;
    const action = isAlreadyToggled ? 'unlike' : 'like';
    let type;
    if (emoji == '✅') type = 'check'
    else if (emoji == '🙏') type = 'pray'
    else if (emoji == '✨') type = 'sparkle'
    else if (emoji == '👏') type = 'clap'        
    else type = 'like'
    console.log("handleEmojiClick, type: ", type)
    
    setTargetEmoji(msgId, type, 0)
    setAction(action=='like')
    toggleEmoji(msgId, userId, toggleKey, action);
  };

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-md shadow-xs p-1 space-x-0">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onMouseDown={() => setPressedEmoji(emoji)}
          onMouseUp={() => setPressedEmoji(null)}
          onMouseLeave={() => setPressedEmoji(null)} // 눌린 상태에서 마우스가 벗어날 경우를 대비해 초기화합니다.
          onClick={(e) => handleEmojiClick(e, emoji)}
          className={`px-2 py-1 text-sm rounded-md hover:bg-gray-200 focus:outline-none transform transition-transform duration-75 ease-in-out ${
            pressedEmoji === emoji ? 'scale-90' : 'scale-100'
          }`}
        >
          <span className="text-[15px]">{emoji}</span>
        </button>
      ))}
    </div>
  );
}

export function EmojiGroup({ msgId, userId, checkCnt, clapCnt, prayCnt, sparkleCnt, likeCnt, onClose, myToggle }: EmojiGroupProps) {

    // 클릭된 이모지 상태 관리
    const [pressedEmoji, setPressedEmoji] = useState<string | null>(null);

    // emojiData 배열을 컴포넌트 내부에서 정의하여 props 값들을 사용
    const emojiData = [
      { emoji: '✅', count: checkCnt, name: 'check' },
      { emoji: '🙏', count: prayCnt, name: 'pray' },
      { emoji: '✨', count: sparkleCnt, name: 'sparkle' },
      { emoji: '👏', count: clapCnt, name: 'clap' },
      { emoji: '❤️', count: likeCnt, name: 'like' },
    ];

    // 이모지 버튼 클릭 시 동작할 함수
    const toggleEmoji = useMessageStore((state) => state.toggleEmoji);
    const setTargetEmoji = useMessageStore((state) => state.setTargetEmoji);
    const setAction = useMessageStore((state) => state.setAction);
    
    // 현재 메시지 정보 가져오기
    const currentMessage = useMessageStore((state) => 
      state.messages.find(msg => msg.msgId === msgId)
    );

    const handleEmojiClick = (e: React.MouseEvent<HTMLButtonElement>, emoji: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const origin = {
        x: (rect.left + rect.right) / 2 / window.innerWidth,
        y: (rect.top + rect.bottom) / 2 / window.innerHeight,
      };
  
      // 폭죽 애니메이션 조절부
      confetti({
        origin: origin,
        particleCount: 300,
        spread: 150,
        angle: 90,
        scalar: 0.9,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 35,
      });
      
      // 이모지 선택 유무 확인
      const toggleKey = emojiToggleMap[emoji];
      if (!toggleKey) return;
      
      // 현재 사용자가 이 이모지를 이미 눌렀는지 확인
      const isAlreadyToggled = currentMessage?.myToggle?.[toggleKey] || false;
      const action = isAlreadyToggled ? 'unlike' : 'like';
      
      let type;
      if (emoji == '✅') type = 'check'
      else if (emoji == '🙏') type = 'pray'
      else if (emoji == '✨') type = 'sparkle'
      else if (emoji == '👏') type = 'clap'        
      else type = 'like'
      console.log("handleEmojiClick, type: ", type)
      
      setTargetEmoji(msgId, emoji, 0)
      setAction(action=='like')
      toggleEmoji(msgId, userId, toggleKey, action);
    };

  return (
    <div className="flex flex-row flex-wrap gap-2 mt-1">
      {emojiData.map(({ emoji, count, name }) => 
        count > 0 && (
          <button
            key={emoji}
            onMouseDown={() => setPressedEmoji(emoji)}
            onMouseUp={() => setPressedEmoji(null)}
            onMouseLeave={() => setPressedEmoji(null)} // 눌린 상태에서 마우스가 벗어날 경우를 대비해 초기화합니다.
            onClick={(e) => handleEmojiClick(e, emoji)}
            className={`flex flex-row h-[26px] min-w-[48px] items-center justify-center gap-1 border rounded-xl p-1 space-x-0 cursor-pointer hover:bg-gray-200 ${
              pressedEmoji === emoji ? 'scale-90' : 'scale-100'
            } ${
              myToggle[name] ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }
            `}
          >
            <span className="text-[15px]">{emoji}</span>
            <span className="text-xs">{count}</span>            
          </button>
        )
      )}
    </div>
  );
}

