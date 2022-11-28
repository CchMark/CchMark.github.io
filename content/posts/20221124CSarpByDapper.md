---
title: "20221124CSarpByDapper"
date: 2022-11-24T16:04:39+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - 基礎
  - Dapper 
  - ASP.NET
---

# Dappar 常用方法


``` C#
public class Customer 
{
  public int CustomerID		{get;set;}
  public string CustomerName	{get;set;}
  public string ContactName	{get;set;}
  public string Address		{get;set;}
  public string City			{get;set;}
  public string PostalCode	{get;set;}
  public string Country		{get;set;}
}

//Dapper  
using (var connection = new SqlConnection(ConnectionString))
{
    //Query 型別說明
    //沒給型別 回傳值IEnumerable<dynamic>
    IEnumerable<dynamic> orderDetails = connection.Query(sqlOrderDetails);
    //如單純取值 用IEnumerable接效能相對好 
    IEnumerable<Customer> orderDetails = connection.Query<Customer>(sqlOrderDetails);
    //如複雜需求要處理再轉List 也很方便
    List<Customer> orderDetails = connection.Query<Customer>(sqlOrderDetails).ToList();

    // QueryMultiple 同時查不同表的應用
    var sql = "SELECT * FROM Customer; SELECT * FROM Supplier;";
    using var conn = new SqlConnection("ConnectionString");
    using var results = conn.QueryMultiple(sql);
    // 第一段 SQL
    var Customer = results.Read<Customer>().ToList();
    // 第二段 SQL
    var Supplier = results.Read<Supplier>().ToList();


    //一般執行 如下寫法
    string sqlCustomerInsert = "INSERT INTO Customers (CustomerName) Values (@CustomerName);";
    var affectedRows = connection.Execute(sqlCustomerInsert,  new {CustomerName = "Mark"});

    //個人是比較喜歡如下寫法  
    var parameters = new DynamicParameters();
    parameters.Add("CustomerName", "Mark");
    var result = connection.Execute(sqlCustomerInsert,parameters)
}
```