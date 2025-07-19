"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface EmojiGroupMenuProps {
  msgId: number;
  userId: string;
  onClose: () => void;
}

interface EmojiGroupProps {
  msgId: number;
  userId: string;
  checkCnt: number;
  prayCnt: number;
  sparkleCnt: number;
  clapCnt: number;
  likeCnt: number;
  myToggle: string[];  
}


const emojis = ['✅', '🙏', '✨', '👏', '❤️'];

const emojiData = [
  { emoji: '✅', count: 1, name: 'check' },
  { emoji: '🙏', count: 2, name: 'pray' },
  { emoji: '✨', count: 3, name: 'sparkle' },
  { emoji: '👏', count: 4, name: 'clap' },
  { emoji: '❤️', count: 5, name: 'like' },
];

export function EmojiGroupMenu({ msgId, userId, onClose }: EmojiGroupMenuProps) {

  // 클릭된 이모지 상태 관리
  const [pressedEmoji, setPressedEmoji] = useState<string | null>(null);

  const handleEmojiClick = (e: React.MouseEvent<HTMLButtonElement>, emoji: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.right) / 2 / window.innerWidth,
      y: (rect.top + rect.bottom) / 2 / window.innerHeight,
    };

    // 폭죽 애니메이션 조절부
    confetti({
      origin: origin,
      particleCount: 100,
      spread: 50,
      angle: 90,
      scalar: 0.5,
      ticks: 200,
      gravity: 1.5,
      decay: 0.94,
      startVelocity: 20,
    });    
    
    setTimeout(() => {
      onClose();
    }, 200); // 애니메이션이 시작될 수 있도록 약간의 지연을 줍니다.
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

export function EmojiGroup({ msgId, userId, checkCnt, prayCnt, sparkleCnt, clapCnt, likeCnt, myToggle }: EmojiGroupProps) {

    // 클릭된 이모지 상태 관리
    const [pressedEmoji, setPressedEmoji] = useState<string | null>(null);

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
    };

  return (
    <div className="flex flex-row flex-wrap gap-2 mt-1">
      {emojiData.map(({ emoji, count, name }) => (
        // count > 0 && (          
          <button
            key={emoji}
            onMouseDown={() => setPressedEmoji(emoji)}
            onMouseUp={() => setPressedEmoji(null)}
            onMouseLeave={() => setPressedEmoji(null)} // 눌린 상태에서 마우스가 벗어날 경우를 대비해 초기화합니다.
            onClick={(e) => handleEmojiClick(e, emoji)}
            className={`flex flex-row h-[26px] min-w-[48px] items-center justify-center gap-1 border rounded-xl p-1 space-x-0 cursor-pointer hover:bg-gray-200 ${
              pressedEmoji === emoji ? 'scale-90' : 'scale-100'
            } 
            `}
          >
            <span className="text-[15px]">{emoji}</span>
            <span className="text-xs">{count}</span>            
          </button>
      ))}
    </div>
  );
}

