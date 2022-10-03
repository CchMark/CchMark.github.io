---
title: "20220628CSharpMVC"
date: 2022-06-28T15:39:27+08:00
author: Mark
description: 版本升級
categories:
  - C Sharp 
tags:
  - 技術
---

#MVC5 bootstrap 3 更新 bootstrap 5 


We replaced the following:
```
bundles.Add(new ScriptBundle("~/bundles/mybundle").Include(
                "~/Scripts/...",
                "~/Scripts/..."));
```
with:
```
bundles.Add(new Bundle("~/bundles/mybundle").Include(
                "~/Scripts/...",
                "~/Scripts/..."));
```

----
```
<nav class="navbar navbar-expand-sm navbar-dark fixed-top bg-dark">
    <div class="container">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        </button>
        <a class="navbar-brand" href="/">應用程式名稱</a>
        <div class="navbar-collapse collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav mr-auto">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/Home/About" class="nav-link">About</a></li>
                <li class="nav-item"><a href="/Home/Contact" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </div>
</nav>
```