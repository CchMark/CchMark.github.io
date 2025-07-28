// Service Worker for caching static assets - 現代化版本
const CACHE_NAME = 'the-mark-chang-life-v2';
const urlsToCache = [
  '/',
  '/css/poole.css',
  '/css/hyde.css',
  '/css/responsive-images.css',
  '/css/print.css',
  '/js/jquery.min.js',
  '/js/soho.js',
  '/js/theme-toggle.js',
  '/js/performance.js',
  '/js/analytics.js',
  '/favicon.png',
  '/apple-touch-icon-144-precomposed.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('SW installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SW installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW installation failed:', error);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('SW activating...');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('SW deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW activation complete');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('SW activation failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('SW cache hit:', event.request.url);
          return response;
        }

        console.log('SW fetching:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.warn('SW cache put failed:', error);
              });

            return response;
          })
          .catch(error => {
            console.error('SW fetch failed:', error);
            // Return offline page or fallback
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
      .catch(error => {
        console.error('SW cache match failed:', error);
        return fetch(event.request);
      })
  );
});

// Handle errors
self.addEventListener('error', event => {
  console.error('SW error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('SW unhandled rejection:', event.reason);
});
