---
title: "ASP.NET Core 6 Mvc 學習筆記 Day 2"
date: 2022-12-08T09:46:01+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - 技術
  - ASP.NET Code
  - .NET 6
---

# .NET 6 如何讀取AppSettings

## AppSettings 
- 由於.Net code 捨棄 Web.config 改為前端常用的JSON格式作為設定檔

好處的部分:
- 依據環境變數切換不同的設定檔
- 使用強型別有效避免型別錯誤
- 預設範本已套用依賴注入

## Step 1

* Program.cs 的builder.Services.AddControllersWithViews(); 下方注入
``` C#
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
```

## Step 2 

* HomeController.cs 撰寫如下Code
``` C#
   public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppSettings _appSettings;

        public HomeController(ILogger<HomeController> logger, IOptions<AppSettings> appSettings)
        {
            _logger = logger;
            _appSettings = appSettings.Value;
        }

        public IActionResult Index()
        {
            ViewBag.EnvType = _appSettings.EnvType;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
```

## Step 3 

* Models 新增AppSettings.cs
``` C#
    public class AppSettings
    {
        public string EnvType { get; set; }
    }
```

## Step 4

* View&rarr;Home&rarr;Index.cshtml 顯示EnvType

``` C#
<div class="text-center">
    <h1 class="display-4">Welcome @ViewBag.EnvType</h1>
</div>
```

### tips
* launchSettings.json 透過調整環境變數 ASPNETCORE_ENVIRONMENT 依據環境讀取不同設定
  - 測試環境 Development(預設)
  - 預備環境 Staging
  - 正式環境 Production


### 參考
[精準解析 ASP.NET Core MVC(.NET6)](https://skilltree.my/Events/2022/12/3/analyzing-asp-dot-net-core-mvc-batch-4)