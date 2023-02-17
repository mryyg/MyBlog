---
title: 函数柯里化（curry）和组合（compose）
date: {{ date }}
tags:
---

> 和纯函数一样，柯里化（curry）和组合（compose）是函数式编程里非常重要的两个概念。
<!-- more -->

## 柯里化（curry）

> 概念：柯里化就是把一个多参数的函数转换为一个嵌套的单参数函数的过程，允许只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

#### 先来看一个小栗子
```
// 普通函数
function add1(x, y) {
  return x + y
}
console.log(add1(2, 10))

// 柯里化函数
function add2(x) {
  return function (y) {
    return x + y
  }
}

console.log(add2(2)(10))
```

#### 柯里化的作用

**参数复用,让函数的职责单一**
```
// 普通函数
function add1(x, y) {
  return x + y
}
console.log(add1(10, 10)) // 20
console.log(add1(10, 1)) // 11
console.log(add1(10, 100)) // 110

// 柯里化函数
function add2(x) {
  return function (y) {
    return x + y
  }
}
const addTen = add2(10)

console.log(addTen(10)) // 20
console.log(addTen(1)) // 11
console.log(addTen(100)) // 110
```
调用add2之后，返回的addTen函数就通过闭包的方式记住了 add2 的第一个参数, 并且addTen函数功能明确。


#### 实现一个简单的curry函数生成器

```
const curryGenerator = (fn) => {
  return function curryFunc(...args) {
    // 如果传入的参数已经足够，则直接调用函数fn
    if (args.length >= fn.length) {
      return fn(...args)
    } else {
      // 否则返回一个新的函数，接收后面传递的新参数；合并参数，递归调用curryFunc
      return (...newArgs) => curryFunc(...args.concat(newArgs))
    }
  }
}
```

来创建一个curry函数检验一下
```
const match = curryGenerator(function (what, str) {
  return str.match(what);
});

console.log(match(/\s+/g, 'hello word')) // [ ' ' ]
const hasSpace = match(/\s+/g)
console.log(hasSpace('hello word')) // [ ' ' ]
console.log(hasSpace('spaceless')) // null
```

注意上面代码，我们在使用curry函数时，会策略性地把要操作的数据，放到最后一个参数里。

## 组合（compose）

> 概念： 组合多个函数，同时返回一个新的函数；调用时，组合函数按顺序从右向左执行；右边函数调用后，返回的结果，作为左边函数的参数传入，严格保证了执行顺序。

```
const compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};

const toUpperCase = function (x) { return x.toUpperCase(); };
const addExclaim = function (x) { return x + '!'; };
const finalStr = compose(addExclaim, toUpperCase);

console.log(finalStr('hello world')) // HELLO WORLD!
```

f 和 g 都是函数，参数x在函数间就好像通过管道传输一样；g 将先于 f 执行，因此就创建了一个从右到左的数据流，这样做的可读性远远高于嵌套一大堆的函数调用。
如果不用compose，上面的finalStr函数就会下面是这样：

```
const finalStr = (x)=>{
  return addExclaim(toUpperCase(x))
}
```
完善一下compose函数，以适应传入更多函数和参数

```
function compose(...fns) {
  if (fns.lenth == 0) return (...args) => args
  return function (...args) {
    let index = fns.length - 1
    let result = fns[index].apply(this, args)
    while (index--) {
      result = fns[index].call(this, result)
    }
    return result
  }
}
```
更高级的实现
```
function compose(...fns) {
  if (fns.lenth == 0) return (...args) => args
  if (fns.length === 1) return fns[0]
  return fns.reduce((f,g)=>(...args)=>f(g(...args)))
}
```
这里借鉴dan大神的代码，非常巧妙的将下一个函数的执行结果作为参数传递给上一个函数，并在最后返回一个接收实际参数的函数。