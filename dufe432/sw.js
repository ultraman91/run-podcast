// 网络优先：联网时总是取最新版本；断网时用上次缓存的版本
const CACHE = "dufe432-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  // 音频交给页面自己缓存（播放时是分段请求，这里不接管）
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.includes("/audio/")) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./")))
  );
});
