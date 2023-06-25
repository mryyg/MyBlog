---
title:  native-js
date: {{ date }}
tags:
---

行车记录仪app-h5项目，js和app端通信
Android是在window上挂一个自定义对象，iOS是借助MessageHandler

<!-- more -->

```
export default function initNativeJs() {
    if (typeof window === 'undefined') return  // 服务端渲染时return

    var atotojs = {};
    atotojs.os = {};
    atotojs.os.isIOS = /iOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    atotojs.os.isAndroid = !atotojs.os.isIOS;
    atotojs.callbacks = {}

    atotojs.takeNativeActionWithCallback = function (commandName, parameters, callback) {
        var callbackName = "nativetojs_callback_" + (new Date()).getTime() + "_" + Math.floor(Math.random() * 10000);
        atotojs.callbacks[callbackName] = callback;

        var request = {};
        request.name = commandName;
        request.param = parameters;
        request.callbackName = callbackName;
        // AtotoWebView是约定的名称
        if (window.atotojs.os.isAndroid) {
            // takeNativeAction是Android那边定义的方法
            window.AtotoWebView.takeNativeAction(JSON.stringify(request));
        } else {
            window.webkit.messageHandlers.AtotoWebView.postMessage(JSON.stringify(request))
        }
    }

    window.atotojs = atotojs;
}
```
