---
title:  refresh-token 
date: {{ date }}
tags:
---


## 无感刷新token-前端部分

最近业务方那边反馈公司的aboss系统使用时会提示登录过期，需要重新登录，比较麻烦；于是项目主管让我们研究一下用户使用过程中token快过期时刷新token。

<!-- more -->

>思路

刷新token需要前后端配合，后端会返回token和refreshToken两个字段，token用于正常调用接口鉴权，refreshToken用于tonken过期时换取新的token，token的时间较短，refreshToken的时间较长。

然后就是具体实现，跟后台老哥约定的是当接口返回401的时候，去调刷新token的接口，如果有新token返回，就将用token替换旧token，然后重新调用一遍刚才返回401的接口，没有返回新token就跳转登录。

需要注意多个接口同时调用时，一是要设置刷新token的状态，是否正在刷新中，如果是，后面接口就不要调刷新的接口了；二是需要处理阻塞的401接口，将其用Promise对象重新包裹一层后，当作resolve状态的值，再将Promise的resolve方法放入执行队列，等待刷新token完成后再重新执行。

>代码

```
// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

function refreshTokenFun() {
  const refreshToken = localStorage.getItem('refreshToken')
  return refreshReq({ method: 'get', url: `/atoto-user/admin/refreshToken?refreshToken=${refreshToken}` })
}

if (res.code === 401) {
        const config = response.config
        if (!isRefreshing) {
          isRefreshing = true
          // debugger
          return refreshTokenFun().then(res => {
            const { code, data } = res.data
            if (code === 200 && data) {
              const { tokenHead, token, refreshToken } = data
              const tokenStr = tokenHead + token
              setToken(tokenStr)
              localStorage.setItem('refreshToken', refreshToken)
              config.headers['Authorization'] = tokenStr
              // 已经刷新了token，将所有队列中的请求进行重试
              requests.forEach(cb => cb(tokenStr))
              requests = []
              return request(config)
            } else {
              goLogin()
            }
          }).catch(err => {
            console.log('refreshToken error', err)
            // goLogin()
          }).finally(() => {
            isRefreshing = false
          })
        } else {
          return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requests.push((token) => {
              config.headers['Authorization'] = token
              resolve(request(config))
            })
          })
        }
      }
```
