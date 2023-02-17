---
title: 防抖和节流
date: {{ date }}
tags:
---

防抖和节流本质上都是优化高频率执行代码的一种手段;
防抖是延迟周期内如果有新动作进入，旧的动作将会被取消,将多次执行变为最后一次执行。
而节流是将多次执行变成每隔一段时间执行。

<!-- more -->

## 防抖

```
function debounce(fn, wait) {
            let timer;
            return (...args) => {
                if (timer) clearTimeout(timer)
                timer = setTimeout(() => {
                    timer = null
                    fn.apply(this, args)
                }, wait)
            }
        }
```

## 节流

```
function throttle (fn, wait) {
            let preTime = 0, timer;
            return function (...args) {
                const ctx = this
                const curTime = Date.now()
                const remaining = curTime - preTime - wait
                clearTimeout(timer)
                if (remaining>=0) {
                    fn.apply(this, args)
                    preTime = Date.now()
                }else{
                    timer = setTimeout(()=>{
                        fn.apply(ctx,args)
                    },wait)
                }
            }
        };
```