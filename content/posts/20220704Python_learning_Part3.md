---
title: "20220704Python_learning_Part3"
date: 2022-07-04T14:04:00+08:00
author: Mark
description: 趣味
categories:
  - Python
tags:
  - 技術
---

#居家上班滑鼠自動移動位置

## 1.套件安裝
`pip install pynput`
`pip install pyautogui`

## 2.code

    from pynput.mouse import Controller
    import random
    import time
    import pyautogui
    
    m = Controller()
    a = m.position  # 偵測滑鼠位置
    s = pyautogui.size()  # 獲得螢幕長寬
    print(s)
    
    while 1:
        time.sleep(1)  # 1秒移動一次
        a = m.position
        pyautogui.moveTo(random.randint(1, s[0]), random.randint(
            1, s[1]), duration=2, tween=pyautogui.easeInOutQuad)  # 隨機移動到屏幕長寬內的位置
        print(a)

[參考文章](https://ithelp.ithome.com.tw/articles/10263995)