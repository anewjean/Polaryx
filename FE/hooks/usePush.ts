'use client';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string | undefined;
const BASE = process.env.NEXT_PUBLIC_BASE;

export function usePush() {
  useEffect(() => {
    if (!PUBLIC_KEY || !BASE) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }
    Notification.requestPermission().then(async perm => {
      if (perm !== 'granted') return;
      const reg = await navigator.serviceWorker.register('/sw.js');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PUBLIC_KEY,
      });
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const { user_id } = jwtDecode<{ user_id: string }>(token);
      await fetch(`http://${BASE}/api/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, subscription: sub }),
      });
    });
  }, []);
}