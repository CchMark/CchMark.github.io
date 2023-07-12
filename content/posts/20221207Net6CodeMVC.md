---
title: "ASP.NET Core 6 Mvc 學習筆記 Day 1"
date: 2022-12-07T14:15:19+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - ASP.NET Code MVC
  - .NET 6
---

# 什麼是MVC 
* MVC 是三個部分組成的
  * Model 模型 
  * View 檢視
  * Controller 控制器

## Model 模型 
* 主要資料處理的部分.
  另外,如果ModelBind有問題時,先確認欄位名稱,欄位名稱對不上就接不到資料,因此就不需進Controller查問題.
  * 資料庫的存取(讀/寫)
  * 資料結構定義
  * 資料格式驗證
  * 資料源頭
  * DAO(Data Access Object 資料訪問物件)
  * DTO(Data Transfer Object 資料傳遞物件)

## View 檢視
* 主要是呈現網頁畫面顯示以及傳遞資料給後端.
除此之外,不要有過多的邏輯和運算寫在View.
  * 輸出: 資料輸出並顯示畫面
    * HTML,CSS,JavaScript
  * 輸入: 畫面輸入的資料傳回後端

## Controller 控制器
* 主要負責接收資料和傳遞資料的部分
  * 控制整體的業務流程
  * 依據規範的格式對資料處理以及View的呈現
  * 控制器接收外部傳入的資料並與Model進行資料處理後決定使用哪種View呈現

## 結論
透過MVC有效實現關注點分離,利於團隊分工.

tips: MVC重點 Model 要肥 Controller 要瘦 View 要笨 (引用Will保哥的口絕XD)

### 參考
[精準解析 ASP.NET Core MVC(.NET6)](https://skilltree.my/Events/2023/8/5/analyzing-asp-dot-net-core-mvc-batch-5/fbb01d0e-cb56-4752-9620-5bdd651470a9)
