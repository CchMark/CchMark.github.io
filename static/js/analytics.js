// 無 Cookie 隱私友好的分析腳本
// 替代傳統 Google Analytics，避免第三方 Cookie

class PrivacyFriendlyAnalytics {
  constructor() {
    this.apiEndpoint = '/api/analytics'; // 自己的後端端點
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.dataQueue = [];
    this.sendTimer = null;
    this.init();
  }

  generateSessionId() {
    // 生成隨機 session ID，不使用 localStorage 或 cookies
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `session_${randomStr}_${timestamp}`;
  }

  async init() {
    try {
      this.trackPageView();
      await this.trackPerformance();
      this.trackUserInteraction();
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
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

  async trackPerformance() {
    try {
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });

      const perfData = performance.getEntriesByType('navigation')[0];
      
      if (perfData) {
        const data = {
          type: 'performance',
          metrics: {
            loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            firstPaint: await this.getFirstPaint(),
            largestContentfulPaint: await this.getLCP()
          },
          sessionId: this.sessionId,
          timestamp: Date.now()
        };

        this.sendData(data);
      }
    } catch (error) {
      console.warn('Performance tracking failed:', error);
    }
  }

  async getFirstPaint() {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? Math.round(firstPaint.startTime) : null;
    } catch (error) {
      return null;
    }
  }

  getLCP() {
    return new Promise((resolve) => {
      try {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(Math.round(lastEntry.startTime));
            observer.disconnect();
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Timeout after 10 seconds
          setTimeout(() => {
            observer.disconnect();
            resolve(null);
          }, 10000);
        } else {
          resolve(null);
        }
      } catch (error) {
        resolve(null);
      }
    });
  }

  trackUserInteraction() {
    // 追蹤點擊事件（無個人資料）
    document.addEventListener('click', (event) => {
      try {
        const target = event.target;
        const element = target.closest('a, button');
        
        if (element) {
          const tagName = element.tagName.toLowerCase();
          const data = {
            type: 'interaction',
            element: tagName,
            text: element.textContent ? element.textContent.substring(0, 50).trim() : '',
            href: element.href || '',
            sessionId: this.sessionId,
            timestamp: Date.now()
          };

          this.sendData(data);
        }
      } catch (error) {
        console.warn('Interaction tracking failed:', error);
      }
    }, { passive: true });

    // 追蹤離開時間
    window.addEventListener('beforeunload', () => {
      try {
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
      } catch (error) {
        console.warn('Session end tracking failed:', error);
      }
    });
  }

  sendData(data) {
    try {
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
    } catch (error) {
      console.warn('Data queuing failed:', error);
    }
  }

  async flushData() {
    try {
      if (this.dataQueue && this.dataQueue.length > 0) {
        // 使用 fetch 發送資料
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.dataQueue)
        });

        this.dataQueue = [];
      }

      if (this.sendTimer) {
        clearTimeout(this.sendTimer);
        this.sendTimer = null;
      }
    } catch (error) {
      console.warn('Analytics data send failed:', error);
      // 清空佇列避免記憶體洩漏
      this.dataQueue = [];
      if (this.sendTimer) {
        clearTimeout(this.sendTimer);
        this.sendTimer = null;
      }
    }
  }
}

// 初始化隱私友好分析
try {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    new PrivacyFriendlyAnalytics();
  }
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}
