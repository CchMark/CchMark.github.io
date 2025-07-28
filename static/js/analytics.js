// 無 Cookie 隱私友好的分析腳本
// 替代傳統 Google Analytics，避免第三方 Cookie

class PrivacyFriendlyAnalytics {
  constructor() {
    this.apiEndpoint = '/api/analytics'; // 自己的後端端點
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.init();
  }

  generateSessionId() {
    // 生成隨機 session ID，不使用 localStorage 或 cookies
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  init() {
    this.trackPageView();
    this.trackPerformance();
    this.trackUserInteraction();
  }

  trackPageView() {
    const data = {
      type: 'pageview',
      url: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      // 不收集個人識別資訊
      screen: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.sendData(data);
  }

  trackPerformance() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      
      const data = {
        type: 'performance',
        metrics: {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstPaint: this.getFirstPaint(),
          largestContentfulPaint: this.getLCP()
        },
        sessionId: this.sessionId,
        timestamp: Date.now()
      };

      this.sendData(data);
    });
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  getLCP() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(null);
      }
    });
  }

  trackUserInteraction() {
    // 追蹤點擊事件（無個人資料）
    document.addEventListener('click', (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      
      if (tagName === 'a' || tagName === 'button') {
        const data = {
          type: 'interaction',
          element: tagName,
          text: target.textContent ? target.textContent.substring(0, 50) : '',
          href: target.href || '',
          sessionId: this.sessionId,
          timestamp: Date.now()
        };

        this.sendData(data);
      }
    });

    // 追蹤離開時間
    window.addEventListener('beforeunload', () => {
      const data = {
        type: 'session_end',
        duration: Date.now() - this.startTime,
        sessionId: this.sessionId,
        timestamp: Date.now()
      };

      // 使用 sendBeacon 確保資料送出
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.apiEndpoint, JSON.stringify(data));
      }
    });
  }

  sendData(data) {
    // 批次發送以減少請求
    if (!this.dataQueue) {
      this.dataQueue = [];
    }

    this.dataQueue.push(data);

    // 每 5 秒或累積 10 個事件時發送
    if (this.dataQueue.length >= 10 || !this.sendTimer) {
      this.flushData();
    }

    if (!this.sendTimer) {
      this.sendTimer = setTimeout(() => {
        this.flushData();
      }, 5000);
    }
  }

  flushData() {
    if (this.dataQueue && this.dataQueue.length > 0) {
      // 使用 fetch 發送資料
      fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.dataQueue)
      }).catch(error => {
        console.log('Analytics data send failed:', error);
      });

      this.dataQueue = [];
    }

    if (this.sendTimer) {
      clearTimeout(this.sendTimer);
      this.sendTimer = null;
    }
  }
}

// 初始化隱私友好分析
if (window.location.hostname !== 'localhost') {
  new PrivacyFriendlyAnalytics();
}
