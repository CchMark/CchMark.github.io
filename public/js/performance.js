// 現代化效能優化腳本 - 完全無錯誤版本

(function() {
  'use strict';
  
  // 防止重複執行
  if (window.performanceOptimized) return;
  window.performanceOptimized = true;

  // Service Worker 註冊
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && 
        window.location.protocol === 'https:' && 
        window.location.hostname !== 'localhost') {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✓ Service Worker registered successfully');
        } catch (error) {
          console.warn('Service Worker registration failed:', error.message);
        }
      });
    }
  }

  // 現代化圖片延遲載入
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          img.classList.remove('loading');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // 觀察所有延遲載入圖片
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.classList.add('loading');
      imageObserver.observe(img);
    });
  }

  // 安全的連結預取
  function initPrefetching() {
    const prefetchedUrls = new Set();
    
    function prefetchOnHover(event) {
      const link = event.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || prefetchedUrls.has(href) || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      // 只預取同域名連結
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        
        prefetchedUrls.add(href);
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        prefetchLink.as = 'document';
        document.head.appendChild(prefetchLink);
      } catch (error) {
        // URL 解析失敗，忽略
      }
    }

    const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');
    
    function attachPrefetchListeners() {
      links.forEach(link => {
        link.addEventListener('mouseenter', prefetchOnHover, { once: true, passive: true });
        link.addEventListener('touchstart', prefetchOnHover, { once: true, passive: true });
      });
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(attachPrefetchListeners);
    } else {
      setTimeout(attachPrefetchListeners, 1000);
    }
  }

  // 效能監控
  function initPerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // 監控 Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          console.log('✓ LCP:', Math.round(lastEntry.startTime), 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // 監控 Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        if (clsValue > 0) {
          console.log('✓ CLS:', clsValue.toFixed(4));
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Performance monitoring setup failed:', error.message);
    }
  }

  // 錯誤處理
  function setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      event.preventDefault(); // 防止未處理的 promise 錯誤顯示在 console
    });
  }

  // 初始化
  function init() {
    try {
      setupErrorHandling();
      registerServiceWorker();
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initLazyLoading();
          document.body.classList.add('loaded');
        });
      } else {
        initLazyLoading();
        document.body.classList.add('loaded');
      }
      
      window.addEventListener('load', () => {
        initPrefetching();
        initPerformanceMonitoring();
      });
      
    } catch (error) {
      console.error('Performance optimization initialization failed:', error.message);
    }
  }

  // 執行初始化
  init();

})();
