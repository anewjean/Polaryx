import { Noto_Sans_KR } from 'next/font/google';
import { Lato } from 'next/font/google';

export const notoSansKr = Noto_Sans_KR({
    variable: '--font-noto-sans-kr',  // CSS 전역 변수로 사용 (글꼴 병렬 처리를 위함)
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',    // 글꼴 로드 전 설정 : 기본 글꼴 → 웹폰트
})

export const lato = Lato({
    variable: '--font-lato',  // CSS 전역 변수로 사용 (글꼴 병렬 처리를 위함)
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',    // 글꼴 로드 전 설정 : 기본 글꼴 → 웹폰트
})