---
title: "20220704Python_learning"
date: 2022-07-04T10:36:37+08:00
author: Mark
description: 趣味
categories:
  - Python
tags:
  - 技術
---
1.確認安裝好基本 Python 開發環境，以及 pip Python 套件管理工具。
---
2.從 Windows 開始選單中，打開「Windows 系統」中的「命令提示字元」。
***
3.在命令提示字元中，使用 pip 安裝 pywin32 套件： pip install pywin32
- - -
4.程式碼 
```import win32gui
import win32con
import winxpgui
import win32api
import subprocess
import time

subprocess.Popen("start chrome", shell=True) ## 開啟chrome網頁
time.sleep(5) ## 這邊讓程式等個五秒，才能抓到下面顯示的頁簽內容
hwnd = win32gui.FindWindow(None, "新分頁 - Google Chrome")  ## 後面的新分頁 - Google Chrome要填入頁簽顯示的名字喔

win32gui.SetWindowLong (hwnd, win32con.GWL_EXSTYLE, win32gui.GetWindowLong (hwnd, win32con.GWL_EXSTYLE ) | win32con.WS_EX_LAYERED )
````winxpgui.SetLayeredWindowAttributes(hwnd, win32api.RGB(0,0,0), 30, win32con.LWA_ALPHA) ## 中間的30是透明度，數字越小越淺，可以自由更改
---

#####上班逛到鐵人賽文章發現非常趣味的文章,紀錄一下過程~XDDDD



[參考文章1](https://officeguide.cc/python-windows-extensions-pywin32-installation/)
[參考文章2](https://ithelp.ithome.com.tw/articles/10258905)