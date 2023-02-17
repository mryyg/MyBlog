---
title: Prue function
date: 2022-03-27 19:44:12
tags:
---


## 概念
> 纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用

<!-- more -->

## 栗子

```
var arr = [1,2,3,4,5];

// 纯的
arr.slice(0,3);
//=> [1,2,3]

arr.slice(0,3);
//=> [1,2,3]

arr.slice(0,3);
//=> [1,2,3]


// 不纯的
arr.splice(0,3);
//=> [1,2,3]

arr.splice(0,3);
//=> [4,5]

arr.splice(0,3);
//=> []
```

看看另一个例子。

```
// 不纯的
var minimum = 21;

var checkAge = function(age) {
  return age >= minimum;
};


// 纯的
var checkAge = function(age) {
  var minimum = 21;
  return age >= minimum;
};
```

## 副作用可能包括...

副作用可能包含，但不限于：

> 更改文件系统
> 往数据库插入记录
> 发送一个 http 请求
> 可变数据
> 打印/log
> 获取用户输入
> DOM 查询
> 访问系统状态

## 追求“纯”的理由

**可缓存性**
**更易于观察和理解**
**纯函数让测试更加容易**
**引用透明性**