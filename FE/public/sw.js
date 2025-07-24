self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "New Message";
  const options = {
    body: data.body || "메시지가 도착했습니다!",
    icon: "/logo.png",
    data: { url: data.url },
  };
  // event.waitUntil(self.registration.showNotification(title, options));
  event.waitUntil(
    (async () => {
      const clientList = await clients.matchAll({ includeUncontrolled: true });

      // Service Worker에서 직접 오디오 재생 시도
      try {
        const audio = new Audio("/alarm.wav");
        await audio.play();
      } catch (error) {
        console.log("Service Worker에서 오디오 재생 실패:", error);
      }

      clientList.forEach((client) => {
        client.postMessage({
          type: "play-sound",
          sound: data.sound || "/alarm.wav",
        });
      });
      await self.registration.showNotification(title, options);
    })(),
  );
});
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      const url = event.notification.data && event.notification.data.url; // payload에서 url 가져옴
      if (clientList.length > 0) {
        return clientList[0].navigate(url).then((client) => client.focus());
      }
      return clients.openWindow(url || "/");
    }),
  );
});
