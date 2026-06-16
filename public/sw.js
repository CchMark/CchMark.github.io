// Service Worker - 快取與效能優化 v3.0
const CACHE_NAME = 'the-mark-chang-life-v3';
const RUNTIME_CACHE = 'runtime-cache-v3';

// 預快取資源清單
const urlsToCache = [
  '/',
  '/css/responsive-images.css',
  '/js/performance.js',
  '/js/analytics.js',
  '/favicon.png',
  '/apple-touch-icon-144-precomposed.png'
];

// 安全的 Service Worker 安裝
self.addEventListener('install', event => {
  console.log('✓ Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('✓ Cache opened successfully');
        
        // 分批預快取，增加成功率
        const results = await Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error.message);
              return null;
            })
          )
        );
        
        const successCount = results.filter(result => result.status === 'fulfilled').length;
        console.log(`✓ Cached ${successCount}/${urlsToCache.length} resources`);
        
        return self.skipWaiting();
      } catch (error) {
        console.error('Service Worker installation failed:', error.message);
      }
    })()
  );
});

// 安全的 Service Worker 啟用
self.addEventListener('activate', event => {
  console.log('✓ Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const cachesToDelete = cacheNames.filter(cacheName => 
          cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
        );
        
        await Promise.all(
          cachesToDelete.map(cacheName => {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        
        await self.clients.claim();
        console.log('✓ Service Worker activation complete');
      } catch (error) {
        console.error('Service Worker activation failed:', error.message);
      }
    })()
  );
});

// 智能 Fetch 處理
self.addEventListener('fetch', event => {
  // 只處理 GET 請求
  if (event.request.method !== 'GET') {
    return;
  }

  // 只處理同域請求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // 靜態資源：快取優先策略
    if (isStaticAsset(pathname)) {
      return await cacheFirstStrategy(request);
    }
    
    // HTML 頁面：網路優先策略
    if (isHTMLRequest(request)) {
      return await networkFirstStrategy(request);
    }
    
    // API 請求：只使用網路
    if (isAPIRequest(pathname)) {
      return await fetch(request);
    }
    
    // 預設：嘗試網路，失敗則用快取
    return await networkWithCacheFallback(request);
    
  } catch (error) {
    console.warn('Request handling failed:', error.message);
    return await cacheMatch(request) || createErrorResponse();
  }
}

function isStaticAsset(pathname) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

function isHTMLRequest(request) {
  const acceptHeader = request.headers.get('Accept') || '';
  return acceptHeader.includes('text/html');
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/') || pathname.startsWith('/analytics');
}

async function cacheFirstStrategy(request) {
  try {
    // 先查快取
    const cachedResponse = await cacheMatch(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 快取未命中，從網路獲取
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // 複製並快取回應
      const responseClone = networkResponse.clone();
      cacheResponse(CACHE_NAME, request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Cache first strategy failed:', error.message);
    // 最後嘗試快取
    return await cacheMatch(request) || createErrorResponse();
  }
}

async function networkFirstStrategy(request) {
  try {
    // 網路優先，3 秒超時
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      const networkResponse = await fetch(request, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (networkResponse && networkResponse.status === 200) {
        // 快取成功的 HTML 回應
        const responseClone = networkResponse.clone();
        cacheResponse(RUNTIME_CACHE, request, responseClone);
      }
      
      return networkResponse;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // 網路失敗，嘗試快取
      const cachedResponse = await cacheMatch(request);
      if (cachedResponse) {
        console.log('Using cached version for:', request.url);
        return cachedResponse;
      }
      
      // 返回離線頁面
      return createOfflineResponse();
    }
  } catch (error) {
    console.warn('Network first strategy failed:', error.message);
    return createOfflineResponse();
  }
}

async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      cacheResponse(RUNTIME_CACHE, request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Network request failed, trying cache:', error.message);
    return await cacheMatch(request) || createErrorResponse();
  }
}

async function cacheMatch(request) {
  try {
    // 先檢查主快取
    const mainCache = await caches.match(request);
    if (mainCache) return mainCache;
    
    // 再檢查運行時快取
    const runtimeCache = await caches.open(RUNTIME_CACHE);
    return await runtimeCache.match(request);
  } catch (error) {
    console.warn('Cache match failed:', error.message);
    return null;
  }
}

async function cacheResponse(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch (error) {
    console.warn(`Failed to cache ${request.url}:`, error.message);
  }
}

function createOfflineResponse() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="utf-8">
      <title>離線模式 - Mark Chang 的生活</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; padding: 2rem; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
        }
        .container { text-align: center; max-width: 500px; }
        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { margin: 0 0 1rem 0; font-size: 2rem; font-weight: 300; }
        p { line-height: 1.6; margin-bottom: 2rem; opacity: 0.9; }
        .retry-btn {
          background: rgba(255,255,255,0.2);
          color: white; border: 2px solid white;
          padding: 0.75rem 2rem; border-radius: 30px;
          cursor: pointer; font-size: 1rem;
          transition: all 0.3s ease;
        }
        .retry-btn:hover { 
          background: white; color: #667eea;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="offline-icon">📡</div>
        <h1>目前無法連接網路</h1>
        <p>您正在離線瀏覽 Mark Chang 的生活。<br>請檢查網路連接後重新載入頁面。</p>
        <button class="retry-btn" onclick="window.location.reload()">重新載入</button>
      </div>
    </body>
    </html>`,
    {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

function createErrorResponse() {
  return new Response('Service Unavailable', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

// 錯誤處理
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.error?.message || event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker unhandled rejection:', event.reason?.message || event.reason);
  event.preventDefault();
});

// 訊息處理
self.addEventListener('message', event => {
  try {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  } catch (error) {
    console.error('Message handling error:', error.message);
  }
});

console.log('✓ Service Worker script loaded successfully');
