---
title: "20220704Python_learning_PART2"
date: 2022-07-04T11:10:18+08:00
draft: true 
author: Mark
description: 趣味
categories:
  - Python
tags:
  - 技術
---

<H1>Selenium + WebDriver 安裝

1. Selenium 安裝
在python裡執行以下程式碼，即可安裝Selenium套件。
`pip install selenium`

2. Webdriver 下載
[Chrome](https://sites.google.com/chromium.org/driver/)要使用Selenium爬蟲前，Webdriver是必備的，而不同的瀏覽器會有不同的driver。以下提供四種常見的瀏覽器driver供大家參考及下載。
選定了瀏覽器，在下載前，請記得檢查目前的瀏覽器版本，再下載對應的Webdriver，之後也要適時更新版本以維護程式碼運行喔！

3.確認是安裝成功

    from selenium import webdriver # 叫出同一目錄的selenium和WebDriver
    driver = webdriver.Chrome() # 此WebDriver是Chrome版本的
    driver.get("https://www.google.com/?hl=zh_tw") # 前往這個網址
    driver.close() # 關閉視窗


[參考文章1](https://ithelp.ithome.com.tw/articles/10261845)
[參考文章2](https://medium.com/marketingdatascience/selenium%E6%95%99%E5%AD%B8-%E4%B8%80-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8webdriver-send-keys-988816ce9bed)