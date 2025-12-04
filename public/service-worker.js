const CACHE_NAME = 'maven-cafe-cache-v1';

self.addEventListener("install", event => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker activated");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache static assets but NOT API calls for real-time data
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Don't cache API calls - they need to be fresh
  const isApiCall = event.request.url.includes('/orders') || 
                   event.request.url.includes('/api/') ||
                   event.request.url.includes('/status');
  
  if (isApiCall) {
    // For API calls, always fetch from network, no caching
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, we could return cached data as fallback
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || new Response('Network error', { status: 503 });
        });
      })
    );
    return;
  }

  // For non-API calls, use normal caching strategy
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request).then(response => {
        // Cache successful responses for static assets only
        if (response.status === 200 && !response.headers.get('content-type')?.includes('application/json')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Return offline fallback for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
