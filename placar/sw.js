// Guarda o placar no aparelho pra abrir sem internet
const CACHE = 'placar-v1'
const ARQ = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'favicon-32.png']
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQ))); self.skipWaiting() })
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('placar-') && k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim() })
// rede primeiro (pega atualizações); sem internet, usa a cópia guardada
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((k) => k.put(e.request, c)); return r }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))))
})
