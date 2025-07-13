// self.addEventListener('push', function(event) {
  
//   const data = event.data ? event.data.json() : {};
//   const title = data.title || 'New Message';
//   const options = {
//     body: data.body || '메시지가 도착했습니다!',
//     icon: '/logo.png'
//   };
//   event.waitUntil(self.registration.showNotification(title, options));
// });


// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();
//   event.waitUntil(clients.matchAll({ type: 'window' }).then(function(clientList) {
//     if (clientList.length > 0) {
//       return clientList[0].focus();
//     }
//     return clients.openWindow('/');
//   }));
// });


export function usePush() {
  useEffect(() => {
    if (!PUBLIC_KEY || !BASE) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    Notification.requestPermission().then(async (perm) => {
      if (perm !== 'granted') return;

      const reg = await navigator.serviceWorker.register('/sw.js');
      const convertedKey = urlBase64ToUint8Array(PUBLIC_KEY);

    
      const oldSub = await reg.pushManager.getSubscription();
      if (oldSub) {
        await oldSub.unsubscribe();
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
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
