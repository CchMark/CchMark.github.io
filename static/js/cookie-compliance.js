// Cookie 合規管理系統 - 確保沒有未經同意的第三方 Cookie

(function() {
  'use strict';
  
  // Cookie 管理器
  const CookieManager = {
    // 檢查是否有用戶同意
    hasConsent: function() {
      return localStorage.getItem('cookie-consent') === 'accepted';
    },
    
    // 設置同意狀態
    setConsent: function(accepted) {
      if (accepted) {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('consent-date', new Date().toISOString());
      } else {
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('consent-date');
        this.clearAllCookies();
      }
    },
    
    // 清除所有 Cookie
    clearAllCookies: function() {
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // 清除當前域名的 Cookie
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      }
    },
    
    // 安全設置 Cookie
    setCookie: function(name, value, days = 7) {
      if (!this.hasConsent()) {
        console.warn('Cookie設置被阻止：用戶尚未同意');
        return false;
      }
      
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
      return true;
    },
    
    // 獲取 Cookie
    getCookie: function(name) {
      if (!this.hasConsent()) {
        return null;
      }
      
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    
    // 顯示 Cookie 同意橫幅
    showConsentBanner: function() {
      if (this.hasConsent() || document.getElementById('cookie-consent-banner')) {
        return;
      }
      
      const banner = document.createElement('div');
      banner.id = 'cookie-consent-banner';
      banner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #2c3e50;
          color: white;
          padding: 1rem;
          text-align: center;
          z-index: 9999;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        ">
          <p style="margin: 0 0 1rem 0; font-size: 14px;">
            我們使用必要的技術 Cookie 來改善您的瀏覽體驗。我們不使用追蹤 Cookie 或第三方分析服務。
          </p>
          <button id="cookie-accept" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            margin: 0 0.5rem;
            border-radius: 4px;
            cursor: pointer;
          ">同意使用</button>
          <button id="cookie-decline" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            margin: 0 0.5rem;
            border-radius: 4px;
            cursor: pointer;
          ">拒絕</button>
        </div>
      `;
      
      document.body.appendChild(banner);
      
      // 事件監聽
      document.getElementById('cookie-accept').addEventListener('click', () => {
        this.setConsent(true);
        banner.remove();
      });
      
      document.getElementById('cookie-decline').addEventListener('click', () => {
        this.setConsent(false);
        banner.remove();
      });
    }
  };
  
  // 初始化
  document.addEventListener('DOMContentLoaded', () => {
    // 清除任何現有的第三方 Cookie
    CookieManager.clearAllCookies();
    
    // 只在生產環境顯示同意橫幅
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setTimeout(() => {
        CookieManager.showConsentBanner();
      }, 1000);
    }
  });
  
  // 將 Cookie 管理器添加到全域
  window.CookieManager = CookieManager;
  
})();
