// Service worker · LLANOS Reportes (app instalable)
// Archivos de la app: primero internet (siempre la versión nueva); si no hay señal, usa la copia guardada.
const CACHE = 'llanos-reportes-v1';
const SHELL = ['./reportes.html', './app-reportes.webmanifest', './icono-reportes-192.png', './icono-reportes-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Firebase, Google y CDN van directo
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./reportes.html'))));
});
