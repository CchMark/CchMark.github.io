// Soho 主題分享功能 - 原生 JavaScript 版本
(function() {
  'use strict';
  
  function initSoho() {
    // 定義社群分享處理邏輯
    const shareServices = {
      'twitter-share-button': function(url, text) {
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      },
      'linkedin-share-button': function(url) {
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      },
      'facebook-share-button': function(url) {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      },
      'telegram-share-button': function(url, text) {
        return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      },
      'pinterest-share-button': function(url, text) {
        return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=&description=${encodeURIComponent(text)}`;
      }
    };

    // 綁定點擊事件
    Object.keys(shareServices).forEach(function(className) {
      const buttons = document.querySelectorAll('.' + className);
      buttons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const url = btn.getAttribute('data-url') || window.location.href;
          const text = btn.getAttribute('data-text') || document.title;
          const shareUrl = shareServices[className](url, text);
          window.open(shareUrl, '_blank').focus();
        });
      });
    });
  }

  // 當 DOM 準備就緒時載入
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoho);
  } else {
    initSoho();
  }
})();

