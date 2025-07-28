// 現代化效能優化腳本 - 移除舊 API，使用現代標準

// Service Worker 註冊
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}

// 現代化圖片延遲載入
document.addEventListener('DOMContentLoaded', () => {
  // 使用現代 Intersection Observer API
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
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
  } else {
    // Fallback for older browsers
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  // 頁面載入完成動畫
  document.body.classList.add('loaded');
});

// 現代化連結預取
const prefetchLinks = () => {
  const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');
  
  if ('requestIdleCallback' in window) {
    // 使用 requestIdleCallback 優化效能
    requestIdleCallback(() => {
      links.forEach(link => {
        link.addEventListener('mouseenter', prefetchOnHover, { once: true });
        link.addEventListener('touchstart', prefetchOnHover, { once: true });
      });
    });
  } else {
    // Fallback
    setTimeout(() => {
      links.forEach(link => {
        link.addEventListener('mouseenter', prefetchOnHover, { once: true });
      });
    }, 1000);
  }
};

const prefetchOnHover = (event) => {
  const href = event.target.getAttribute('href');
  if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = href;
    prefetchLink.as = 'document';
    document.head.appendChild(prefetchLink);
  }
};

// 效能監控
const performanceMonitor = () => {
  if ('PerformanceObserver' in window) {
    // 監控 Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // 監控 First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // 監控 Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
};

// 安全的第三方資源載入
const loadThirdPartyResources = () => {
  // 延遲載入 Google Analytics（如果需要）
  window.addEventListener('load', () => {
    if (window.gtag) {
      gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure'
      });
    }
  });
};

// 初始化
window.addEventListener('load', () => {
  prefetchLinks();
  performanceMonitor();
  loadThirdPartyResources();
});
