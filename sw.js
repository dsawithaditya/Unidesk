/* Unidesk Campus Helpdesk - Offline Service Worker (Network-First + Offline Cache Fallback) */
const CACHE_NAME = 'unidesk-v4.0';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './logo-icon.svg',
  './logo-icon.png',
  './logo-white.svg',
  './logo-white.png',
  './logo.svg',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.all(
        PRECACHE_ASSETS.map(url =>
          fetch(new Request(url, { cache: 'reload' }))
            .then(res => {
              if (res && res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()).then(async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Handle chrome extension or unsupported schemes
  if (!url.protocol.startsWith('http')) return;

  // Static Assets & Same-Origin: Network-First with Offline Cache Fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req).then(networkRes => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
        }
        return networkRes;
      }).catch(() => {
        return caches.match(req, { ignoreSearch: true }).then(cached => {
          if (cached) return cached;
          if (req.mode === 'navigate') {
            return caches.match('./index.html', { ignoreSearch: true });
          }
        });
      })
    );
    return;
  }

  // Third-party CDN / Fonts: Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(req).then(cached => {
        const fetchPromise = fetch(req).then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            cache.put(req, networkRes.clone());
          }
          return networkRes;
        }).catch(() => cached);

        return cached || fetchPromise;
      });
    })
  );
});

