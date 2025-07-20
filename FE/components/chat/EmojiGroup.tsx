"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useMessageStore } from '@/store/messageStore';

interface EmojiGroupMenuProps {
  msgId: number;
  userId: string;
  onClose: () => void;
  checkCnt: number;
  prayCnt: number;
  sparkleCnt: number;
  clapCnt: number;
  likeCnt: number;
  myToggle: {
    check: boolean;
    pray: boolean;
    sparkle: boolean;
    clap: boolean;
    like: boolean;
  }
}

interface EmojiGroupProps {
  msgId: number;
  userId: string;
  onClose: () => void;
  checkCnt: number;
  prayCnt: number;
  sparkleCnt: number;
  clapCnt: number;
  likeCnt: number;
  myToggle: {
    check: boolean;
    pray: boolean;
    sparkle: boolean;
    clap: boolean;
    like: boolean;
  }
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

export function EmojiGroupMenu({ msgId, userId, checkCnt, clapCnt, prayCnt, sparkleCnt, likeCnt, onClose, myToggle }: EmojiGroupMenuProps) {
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

    // 분수대 효과 - 솟구쳤다가 빠른 자유낙하 + 1초간 파티클 반복 생성
    const createFountainEffect = () => {
      confetti({
        origin: origin,
        particleCount: 2, // 적은 개수로 여러 번 생성
        spread: 25, // 적당한 퍼짐
        angle: 90, // 위쪽 방향
        scalar: 1.8, // 이모지 크기
        ticks: 600, // 짧은 지속시간으로 빠른 낙하
        gravity: 7.5, // 강한 중력으로 빠른 자유낙하
        decay: 0.9, // 적당한 페이드아웃
        startVelocity: 30, // 적당한 초기 속도
        flat: true, // 2D 평면 효과
        shapes: [confetti.shapeFromText({ text: emoji, scalar: 2 })],
        drift: 0, // 수직 낙하
      });
    };

    // 1초간 파티클 반복 생성 (100ms 간격으로 10번)
    createFountainEffect(); // 즉시 첫 번째 실행
    const intervals = [];
    for (let i = 1; i < 5; i++) {
      const timeoutId = setTimeout(createFountainEffect, i * 100);
      intervals.push(timeoutId);
    }    
    
    setTimeout(() => {
      onClose();
    }, 600); // 애니메이션이 시작될 수 있도록 약간의 지연을 줍니다.
    
    // 이모지 선택 유무 확인
    const toggleKey = emojiToggleMap[emoji];   
    
    let type;
    let count;
    if (emoji == '✅') { type = 'check'; count = checkCnt }
    else if (emoji == '🙏') { type = 'pray'; count = prayCnt }
    else if (emoji == '✨') { type = 'sparkle'; count = sparkleCnt }
    else if (emoji == '👏') { type = 'clap'; count = clapCnt }
    else { type = 'like'; count = likeCnt }

    console.log("handleEmojiClick, type: ", type)
    // 현재 사용자가 이 이모지를 이미 눌렀는지 확인 (myToggle 키 사용)
    const isAlreadyToggled = currentMessage?.myToggle?.[type] || false;
    const action = isAlreadyToggled ? 'unlike' : 'like';
    
    setTargetEmoji(msgId, type, count)
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
  
      // 분수대 효과 - 솟구쳤다가 빠른 자유낙하 + 1초간 파티클 반복 생성
      const createFountainEffect = () => {
        confetti({
          origin: origin,
          particleCount: 2, // 적은 개수로 여러 번 생성
          spread: 25, // 적당한 퍼짐
          angle: 90, // 위쪽 방향
          scalar: 1.8, // 이모지 크기
          ticks: 600, // 짧은 지속시간으로 빠른 낙하
          gravity: 7.5, // 강한 중력으로 빠른 자유낙하
          decay: 0.9, // 적당한 페이드아웃
          startVelocity: 30, // 적당한 초기 속도
          flat: true, // 2D 평면 효과
          shapes: [confetti.shapeFromText({ text: emoji, scalar: 2 })],
          drift: 0, // 수직 낙하
        });
      };

      // 1초간 파티클 반복 생성 (100ms 간격으로 10번)
      createFountainEffect(); // 즉시 첫 번째 실행
      const intervals = [];
      for (let i = 1; i < 5; i++) {
        const timeoutId = setTimeout(createFountainEffect, i * 100);
        intervals.push(timeoutId);
      }
      
      // 이모지 선택 유무 확인
      const toggleKey = emojiToggleMap[emoji];
      if (!toggleKey) return;
      
      // 현재 사용자가 이 이모지를 이미 눌렀는지 확인
      
      let type;
      let count;
      if (emoji == '✅') { type = 'check'; count = checkCnt }
      else if (emoji == '🙏') { type = 'pray'; count = prayCnt }
      else if (emoji == '✨') { type = 'sparkle'; count = sparkleCnt }
      else if (emoji == '👏') { type = 'clap'; count = clapCnt }
      else { type = 'like'; count = likeCnt }
      console.log("handleEmojiClick, type: ", type)

      const isAlreadyToggled = currentMessage?.myToggle?.[type] || false;
      const action = isAlreadyToggled ? 'unlike' : 'like';
      
      setTargetEmoji(msgId, emoji, count)
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
            className={`flex flex-row h-[26px] min-w-[48px] items-center justify-center gap-1 border rounded-xl p-1 space-x-0 cursor-pointer ${
              pressedEmoji === emoji ? 'scale-90' : 'scale-100'
            } ${
              myToggle[name] ? 'bg-blue-500 text-white border-blue-700 hover:bg-blue-600' : 'bg-gray-200 border-gray-400 hover:bg-gray-300'
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

