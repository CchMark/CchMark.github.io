// 隱私友善無 Cookie 分析系統 - 完全無錯誤版本

class PrivacyFriendlyAnalytics {
  constructor() {
    this.apiEndpoint = '/api/analytics'; // 自定義後端端點
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.dataQueue = [];
    this.sendTimer = null;
    this.initialized = false;
    this.safeInit();
  }

  generateSessionId() {
    try {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 11);
      return `session_${randomStr}_${timestamp}`;
    } catch (error) {
      return `session_fallback_${Date.now()}`;
    }
  }

  async safeInit() {
    try {
      // 檢查 Do Not Track 設定
      if (this.isTrackingDisabled()) {
        console.log('✓ Analytics disabled due to privacy settings');
        return;
      }

      this.initialized = true;
      this.trackPageView();
      await this.trackPerformance();
      this.setupEventListeners();
      
      console.log('✓ Privacy-friendly analytics initialized');
      
    } catch (error) {
      console.warn('Analytics initialization failed:', error.message);
    }
  }

  isTrackingDisabled() {
    try {
      return navigator.doNotTrack === '1' || 
             window.doNotTrack === '1' || 
             navigator.msDoNotTrack === '1';
    } catch (error) {
      return false;
    }
  }

  trackPageView() {
    if (!this.initialized) return;
    
    try {
      const data = {
        type: 'pageview',
        url: window.location.pathname, // 不包含查詢參數
        referrer: this.getSafeReferrer(),
        userAgent: this.getBrowserInfo(),
        timestamp: Date.now(),
        sessionId: this.sessionId,
        screen: this.getScreenInfo(),
        viewport: this.getViewportInfo(),
        language: navigator.language || 'unknown',
        timezone: this.getTimezone()
      };

      this.queueData(data);
    } catch (error) {
      console.warn('Page view tracking failed:', error.message);
    }
  }

  getSafeReferrer() {
    try {
      const referrer = document.referrer;
      if (!referrer) return 'direct';
      
      const referrerUrl = new URL(referrer);
      const currentUrl = new URL(window.location.href);
      
      // 如果是同域，返回內部
      if (referrerUrl.hostname === currentUrl.hostname) {
        return 'internal';
      }
      
      // 只返回域名，保護隱私
      return referrerUrl.hostname;
    } catch (error) {
      return 'unknown';
    }
  }

  getBrowserInfo() {
    try {
      const ua = navigator.userAgent;
      if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
      if (ua.includes('Edg')) return 'Edge';
      return 'Other';
    } catch (error) {
      return 'Unknown';
    }
  }

  getScreenInfo() {
    try {
      if (typeof screen !== 'undefined' && screen.width && screen.height) {
        return {
          width: screen.width,
          height: screen.height
        };
      }
      return { width: 0, height: 0 };
    } catch (error) {
      return { width: 0, height: 0 };
    }
  }

  getViewportInfo() {
    try {
      return {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      };
    } catch (error) {
      return { width: 0, height: 0 };
    }
  }

  getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  async trackPerformance() {
    if (!this.initialized) return;
    
    try {
      // 等待頁面載入完成
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true });
        });
      }

      const perfData = this.getNavigationData();
      
      if (perfData) {
        const data = {
          type: 'performance',
          metrics: {
            loadTime: this.calculateLoadTime(perfData),
            domContentLoaded: this.calculateDOMTime(perfData),
            firstPaint: await this.getFirstPaint(),
            largestContentfulPaint: await this.getLCP()
          },
          sessionId: this.sessionId,
          timestamp: Date.now()
        };

        this.queueData(data);
      }
    } catch (error) {
      console.warn('Performance tracking failed:', error.message);
    }
  }

  getNavigationData() {
    try {
      const entries = performance.getEntriesByType('navigation');
      return entries.length > 0 ? entries[0] : null;
    } catch (error) {
      return null;
    }
  }

  calculateLoadTime(perfData) {
    try {
      if (perfData.loadEventEnd && perfData.loadEventStart) {
        return Math.round(perfData.loadEventEnd - perfData.loadEventStart);
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  calculateDOMTime(perfData) {
    try {
      if (perfData.domContentLoadedEventEnd && perfData.domContentLoadedEventStart) {
        return Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  async getFirstPaint() {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? Math.round(firstPaint.startTime) : 0;
    } catch (error) {
      return 0;
    }
  }

  getLCP() {
    return new Promise((resolve) => {
      try {
        if (!('PerformanceObserver' in window)) {
          resolve(0);
          return;
        }

        const observer = new PerformanceObserver((entryList) => {
          try {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
              const lastEntry = entries[entries.length - 1];
              resolve(Math.round(lastEntry.startTime));
            } else {
              resolve(0);
            }
            observer.disconnect();
          } catch (error) {
            resolve(0);
            observer.disconnect();
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // 10 秒後超時
        setTimeout(() => {
          try {
            observer.disconnect();
            resolve(0);
          } catch (error) {
            resolve(0);
          }
        }, 10000);
        
      } catch (error) {
        resolve(0);
      }
    });
  }

  setupEventListeners() {
    if (!this.initialized) return;
    
    try {
      // 點擊事件追蹤
      document.addEventListener('click', (event) => {
        this.handleClickEvent(event);
      }, { passive: true });

      // 頁面可見性變化
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      }, { passive: true });

      // 頁面卸載
      window.addEventListener('beforeunload', () => {
        this.handleBeforeUnload();
      }, { passive: true });

      // 滾動追蹤（節流）
      this.setupScrollTracking();
      
    } catch (error) {
      console.warn('Event listeners setup failed:', error.message);
    }
  }

  handleClickEvent(event) {
    try {
      const target = event.target;
      const element = target.closest('a, button');
      
      if (element) {
        const data = {
          type: 'interaction',
          element: element.tagName.toLowerCase(),
          text: element.textContent ? element.textContent.substring(0, 50).trim() : '',
          href: element.href ? this.sanitizeUrl(element.href) : '',
          sessionId: this.sessionId,
          timestamp: Date.now()
        };

        this.queueData(data);
      }
    } catch (error) {
      console.warn('Click tracking failed:', error.message);
    }
  }

  sanitizeUrl(url) {
    try {
      if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        return url.split('?')[0];
      }
      
      const urlObj = new URL(url, window.location.origin);
      return urlObj.pathname;
    } catch (error) {
      return 'invalid-url';
    }
  }

  handleVisibilityChange() {
    try {
      if (document.visibilityState === 'hidden') {
        this.flushData();
      }
    } catch (error) {
      console.warn('Visibility change handling failed:', error.message);
    }
  }

  handleBeforeUnload() {
    try {
      const data = {
        type: 'session_end',
        duration: Date.now() - this.startTime,
        sessionId: this.sessionId,
        timestamp: Date.now()
      };

      // 使用 sendBeacon 同步發送
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.apiEndpoint, JSON.stringify([data]));
      }
    } catch (error) {
      console.warn('Session end tracking failed:', error.message);
    }
  }

  setupScrollTracking() {
    let scrollTimeout;
    const scrollMilestones = new Set();
    
    const handleScroll = () => {
      try {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollPercent = this.calculateScrollPercent();
          const milestone = Math.floor(scrollPercent / 25) * 25;
          
          if (milestone > 0 && !scrollMilestones.has(milestone)) {
            scrollMilestones.add(milestone);
            
            const data = {
              type: 'scroll',
              milestone: milestone,
              sessionId: this.sessionId,
              timestamp: Date.now()
            };
            
            this.queueData(data);
          }
        }, 100);
      } catch (error) {
        console.warn('Scroll tracking failed:', error.message);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  calculateScrollPercent() {
    try {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
    } catch (error) {
      return 0;
    }
  }

  queueData(data) {
    if (!this.initialized) return;
    
    try {
      this.dataQueue.push(data);

      // 每 10 個事件或 5 秒發送一次
      if (this.dataQueue.length >= 10) {
        this.flushData();
      } else if (!this.sendTimer) {
        this.sendTimer = setTimeout(() => {
          this.flushData();
        }, 5000);
      }
    } catch (error) {
      console.warn('Data queuing failed:', error.message);
    }
  }

  async flushData() {
    if (!this.initialized || !this.dataQueue || this.dataQueue.length === 0) {
      return;
    }
    
    try {
      const dataToSend = [...this.dataQueue]; // 創建副本
      this.dataQueue = []; // 清空佇列
      
      if (this.sendTimer) {
        clearTimeout(this.sendTimer);
        this.sendTimer = null;
      }

      // 使用 fetch 發送資料
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        keepalive: true
      });

      if (!response.ok) {
        console.warn(`Analytics: Server responded with ${response.status}`);
      }
      
    } catch (error) {
      console.warn('Analytics data send failed:', error.message);
      // 清空計時器避免重複發送
      if (this.sendTimer) {
        clearTimeout(this.sendTimer);
        this.sendTimer = null;
      }
    }
  }
}

// 安全初始化
(function() {
  'use strict';
  
  try {
    // 只在非開發環境啟用
    if (window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1' && 
        window.location.hostname !== '') {
      
      // 等待 DOM 準備就緒
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          window.analytics = new PrivacyFriendlyAnalytics();
        });
      } else {
        window.analytics = new PrivacyFriendlyAnalytics();
      }
    } else {
      console.log('✓ Analytics disabled in development environment');
    }
  } catch (error) {
    console.warn('Analytics initialization failed:', error.message);
  }
})();
