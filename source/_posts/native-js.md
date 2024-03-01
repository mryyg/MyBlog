---
title: native-js
date: { { date } }
tags:
---

行车记录仪 app-h5 项目，js 和 app 端通信
Android 是在 window 上挂一个自定义对象，iOS 是借助 MessageHandler

<!-- more -->

```js
export default function initNativeJs() {
  if (typeof window === "undefined") return; // 服务端渲染时return

  var atotojs = {};
  atotojs.os = {};
  atotojs.os.isIOS = /iOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
  atotojs.os.isAndroid = !atotojs.os.isIOS;
  atotojs.callbacks = {};

  /**
   * 带回调函数的请求函数
   * @param {string} commandName 和app那边约定的事件名称
   * @param {object} parameters 参数对象
   * @param {function} callback 回调函数
   * */
  atotojs.takeNativeActionWithCallback = async function (
    commandName,
    parameters,
    callback
  ) {
    var callbackName =
      "nativetojs_callback_" +
      new Date().getTime() +
      "_" +
      Math.floor(Math.random() * 10000);
    //  将回调函数挂到对象atotojs上，方便app那边调用
    atotojs.callbacks[callbackName] = callback;

    /**
     * request 是和app约定的请求JSON字符串
     * @param {string} name 事件名称
     * @param {object} param 参数
     * @param {string} callbackName 回调函数名称，app通过在webview执行此函数，将值回传给H5这边
     * */
    var request = {};
    request.name = commandName;
    request.param = parameters;
    request.callbackName = callbackName;
    // JavaNative是app挂载在window全局对象上的属性，值是一个对象
    if (window.atotojs.os.isAndroid) {
      // takeNativeAction是Android那边定义触发事件方法
      window.JavaNative.takeNativeAction(JSON.stringify(request));
    } else {
      window.webkit.messageHandlers.JavaNative.postMessage(
        JSON.stringify(request)
      );
    }
  };

  window.atotojs = atotojs;
}
```
