// 確保 jQuery 載入後再執行
(function() {
  'use strict';
  
  function initSoho() {
    if (typeof $ === 'undefined') {
      console.warn('jQuery not loaded, retrying in 100ms...');
      setTimeout(initSoho, 100);
      return;
    }

    $(document).ready(function(){

  $(".twitter-share-button").click(function (e) {
    e.preventDefault();
    var self = $(this);
    var url = encodeURIComponent(self.data("url"));
    var text = encodeURIComponent(self.data("text"));

    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank").focus();
  });

  $(".linkedin-share-button").click(function (e) {
    e.preventDefault();
    var self = $(this);
    var url = encodeURIComponent(self.data("url"));
    // var text = encodeURIComponent(self.data("text"));

    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank").focus();
  });

  $(".facebook-share-button").click(function (e) {
    e.preventDefault();
    var self = $(this);
    var url = encodeURIComponent(self.data("url"));
    // var text = encodeURIComponent(self.data("text"));

    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank").focus();
  });

  $(".telegram-share-button").click(function (e) {
    e.preventDefault();
    var self = $(this);
    var url = encodeURIComponent(self.data("url"));
    var text = encodeURIComponent(self.data("text"));

    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank").focus();
  });

  $(".pinterest-share-button").click(function (e) {
    e.preventDefault();
    var self = $(this);
    var url = encodeURIComponent(self.data("url"));
    var text = encodeURIComponent(self.data("text"));

    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=&description=${text}`, "_blank").focus();
  });

  }); // $(document).ready 結束
  
  } // initSoho 函數結束
  
  // 開始初始化
  initSoho();
  
})(); // IIFE 結束
