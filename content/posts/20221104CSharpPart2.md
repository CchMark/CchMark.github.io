---
title: "辦別IEnumerable和List用途"
date: 2022-11-04T16:01:16+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - 基礎
---

# IEnumerable 和 List 區別

## IEnumerable 與 List 差異
     
C# 中 IEnumerable 和 List 的主要區別在於 IEnumerable 是一個介面，而 List 是一個具體的class可以new 出來實作。此外， IEnumerable 是只讀的，而 List 不是。 List 提供Add、Clear、Contains、IndexOf、RemoveAt、Count等方法，而 IEnumerable 提供了一個介面來接收集合資料，用於逐一讀取集合中的資料內容（枚舉）。

 - IEnumerable 和 List 都是 .NET 的 System.Collections 命名空間的一部分。

##  延期執行
- 使用 LINQ 時，IEnumerable 和 List 之間的區別很明顯。
- IEnumerable 是延遲執行，而 List 是立即執行。
- IEnumerable 在枚舉之前不會執行查詢，而 List 將在調用後立即執行查詢。延遲執行使 IEnumerable 更快，因為它只在需要時讀取資料。
- 我們使用 LINQ 來查詢數字列表。即使 LINQ Where 返回一個 IEnumerable，執行也會延遲到我們調用 ToList()。當使用 ToList() 時，則會強制編譯器立即執行結果。
- 當只需要枚舉一次時，IEnumerable 效率更高、速度更快。但如需要多次枚舉時，List 效率更高，因為它已經將所有資料都保存在記憶體中。

## 介面和實例
IEnumerator 介面定義編譯器如何一次訪問一個集合中的元素（枚舉）。IEnumerable 在內部使用 IEnumerator 並且是枚舉集合內容的推薦方式。<br>
另一方面，List 在內部使用 IList，一個非泛型接口。<br>
IList 允許更直接地操作列表的內容，並且是操作列表的推薦方式。<br>
IEnumerable 和 IList 的區別在於 IEnumerable 只提供了一種枚舉列表內容的方法，而 IList 提供了一種操作列表本身的方法。

## 設計方法時應該使用 List 還是 IEnumerable？

- 如果我只需要像迭代這樣的集合的基本功能，請使用 IEnumerable。如果我需要對集合進行更多元的操作，請使用 IList、ICollection。
 -  在 C# 中設計方法時，最好使用介面而不是實例化，因為它提供了最大的靈活性。<br>例如，如果我們的方法接受 IEnumerable 作為參數，那麼調用者可以傳入 List、 Array、Dictionary或任何實現 IEnumerable 的集合。

## IEnumerable 比 List 快嗎？

由於延遲執行，IEnumerable 在概念上比 List 更快。延遲執行使 IEnumerable 更快，因為它只在需要時讀取資料。與始終將資料儲存在記憶體中的List相反。

[參考文章](https://josipmisko.com/posts/c-sharp-ienumerable-vs-list)