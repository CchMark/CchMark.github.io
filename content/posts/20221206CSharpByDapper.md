---
title: "2022CSharpByDapper"
date: 2022-12-06T09:56:44+08:00
author: Mark
description: 筆記
categories:
  - C Sharp 
tags:
  - 技術
  - Dapper 
  - ASP.NET
---

# 使用Dapper Transaction 和 Bulk Insert 介紹

- Dapper Transaction 範例 
``` C#
public class Customer 
{
	public int CustomerID {get;set;}
	public string CustomerName {get;set;}
	public string ContactName {get;set;}
	public string Address {get;set;}
	public string City {get;set;}
	public string PostalCode {get;set;}
	public string Country {get;set;}
}

using (var connection = new SqlConnection(connectionString))
{
	connection.Open();
	
	using (var transaction = connection.BeginTransaction())
	{
	    var sqlString = @"SELECT * FROM Customer Where CustomerName = @CustomerName";
	    var parameters = new DynamicParameters();
		parameters.Add("CustomerName", "Mark");
		// Dapper
		var affectedRows1 = connection.Execute(sqlString, parameters, transaction: transaction);

		// Dapper Transaction
		var affectedRows2 = transaction.Execute(sqlString, parameters);

		transaction.Commit();
	}
}

```

- Bulk Insert 範例

``` C#
	
	List<Customer> customers = new List<Customer>();

	//新增單筆資料	
	using (var connection = new SqlConnection(connectionString))
	{
		customers.Add(
			new Customer() 
		{ 
			CustomerName = "ExampleBulkInsert Single", 
			ContactName = "Example Name : Mark " 
		});
		connection.BulkInsert(customers);
	}	

	//新增多筆資料
	for (int i =0;i<200;i++)
	{
		customers.Add(
			new Customer() 
		{ 
			CustomerName = "ExampleBulkInsert Many", 
			ContactName = "Example Name : Mark" +  i 
		});
	}
	using (var connection = new SqlConnection(connectionString))
	{
		connection.BulkInsert(customers);
	}

```