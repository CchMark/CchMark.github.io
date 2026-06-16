---
title: "C# .NET 型別"
date: 2022-09-20T10:24:24+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - 技術
  - ASP.NET
---

# C# .NET 型別 

## 參考型別(Reference Type)
-  參考類型的變數會儲存期資料 (物件) 的參考，使用參考類型時，可以使兩個變數參考相同的物件，因此對其中一個變數進行的內容變更，可能會影響另一個變數所參考的物件。 **但使用實值型別時，每個變數都有自己的資料(Stack)，因此對某一個變數進行的內容變更，不會影響另一個變數。**


     - 換句話說，當宣告變數時，值是Stack存放的是一個參考，指向真正的值存在的Heap區域。 
     - 參考型別常用名稱如下所示:
  
       |型態類別|關鍵字   |
       |--:|--:|
       |**類別**	|**Class**     |
       |**介面**	|**Interface** |
       |**委派**|**delegate**  |
       |動態|dynamic|
       |物件|object|
       |字串|String|
       |紀錄|record|

## 實值型別(Value Type)
- 實值型別的變數，依據預設在指派時，將引數傳遞至方法，並傳回方法結果時，會複製變數值。 在實值型別變數的情況下，會複製對應的類型實例。 

  - 換句話說，當宣告變數時，是在記憶體中直接存放值(Stack)
  - 實質型別常用名稱如下所示:

      |型態類別	| 關鍵字	|
      |--|--|
      |整數		| byte		|
      |整數		| sbyte		|
      |整數		| short		|
      |整數		| ushort	|
      |整數		| int		|
      |整數		| uint		|
      |整數		| long		|
      |整數		| ulong		|
      |浮點數		| float		|
      |浮點數		| double	|
      |浮點數		| decimal	|
      |字元		| char	 	|
      |字元		| bool	 	|
      |**列舉**|**enum**|
      |**結構**|**struct**|

##### Stack:後進先出, 實值型別
#####  Heap:一塊存放參考型別資料的記憶體空間
##### 另外，記錄類型(record)在 C# 10 允許參考型別 (record class )為參考型別，並 實值型別 (record struct)定義實值型別。

## 總結:
- 參考型別:即變數的記憶體空間(Stack)裡存放的為『Heap記憶體位址』。
  -  參考型別變數儲存的是該物件的參考，也就是該物件在 Managed Heap 的位址。
  - 參考型別變數的記憶體是固定大小的。  
- 實值型別:即變數的記憶體(Stack)空間裡存放的為『內容(值)』。
  - 一定會繼承System.ValueType 
  - 實值型別變數儲存的是該物件本身。
  - 實值型別變數的記憶體是依據其內容所需決定的


---
### 範例說明:

    private static void Main(string[] args)
    {
        //參考型別
        MyRefClass v1Ref = new MyRefClass();
        //實值型別
        MyValStruct v1Val = new MyValStruct();

        v1Ref.x = 666;
        v1Val.x = 666;

        MyRefClass v2Ref = v1Ref;//v2Ref 指向 v1Ref同個記憶體位置 
        MyValStruct v2Val = v1Val; // v2Val 是給值 666

        v1Ref.x = 200; //由於 v1Ref 和 v2Ref 是指向相同記憶體位置 故 v1Ref & v2Ref 都為200
        v2Val.x = 200; //v2Val 是值從666變更為200

        Console.WriteLine("refVar1 " + v1Ref.x);//200
        Console.WriteLine("refVar2 " + v2Ref.x);//200
        Console.WriteLine("valVar1 " + v1Val.x);//666
        Console.WriteLine("valVar2 " + v2Val.x);//200

    }

    public class MyRefClass
    {
        public int x { get; set; }
    }
    public struct MyValStruct
    {
        public int x { get; set; }
    }
---

若有錯誤之處或疑慮的部分，煩請來信告知，謝謝!

## **參考文獻**

[鬆學會物件導向（使用C#）](https://skilltree.my/Events/2022/9/17/OOP-Batch-22)

[參考類型 (C# 參考)](https://learn.microsoft.com/zh-hk/dotnet/csharp/fundamentals/types/classes)

[實值型別 (C# 參考)](https://learn.microsoft.com/zh-tw/dotnet/csharp/language-reference/builtin-types/value-types)

[參考文章2](https://xingulin.tumblr.com/post/48493582986/ref-type-vs-val-type)

[參考文章3](https://dotblogs.com.tw/h091237557/2014/05/26/145247)


