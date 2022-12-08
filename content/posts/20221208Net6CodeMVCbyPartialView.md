---
title: "ASP.NET Core 6 Mvc 學習筆記 Day 2-2"
date: 2022-12-08T14:39:05+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - ASP.NET Code MVC
  - .NET 6
---

# Partial View 部分檢視
* 主要應用於HTML重用,由於Partial View 無法取得Model需要透過外部呼叫
* 透過Model傳遞才能取得資料綁定
  * 通常預設情境下子類別會自動繼承父類別的Model
* 呼叫方式:
``` C#
  //tag helper
  <partial name="something">
  //html helper 個人偏好使用這個XD
  @Html.Partial("something")

```

##範例
### Setp 1 : Models新增Sample.cs
``` C# 
public class Sample
{
  public string Id { get; set; }
  public string Content { get; set; }
  public string Tag { get; set; }
}
```
### Setp 2 : View &rarr; Shared &rarr; 新增_sample.cshtml
``` C# 
@model Sample

@($"partial view {Model.Id} ~")
<hr/>
@($"partial view {Model.Content} ~")
<hr />
@($"partial view {Model.Tag} ~")
```
### Step 3 : View  &rarr; Home  &rarr; Index.cshtml

``` C# 
@model Sample
@{
    ViewData["Title"] = "Home Page";
}

<div class="text-center">
    <h1 class="display-4">Welcome @ViewBag.EnvType</h1>
    @Html.Partial("_sample")
</div>

```

### Step 4 : HomeController
``` C#
  public IActionResult Index()
  {
      ViewBag.EnvType = _appSettings.EnvType;
      var result = new Sample {Id=1, Content = "我是內容", Tag = "NET6MVC" };
      return View(result);
  }
```


### 參考
[精準解析 ASP.NET Core MVC(.NET6)](https://skilltree.my/Events/2022/12/3/analyzing-asp-dot-net-core-mvc-batch-4)