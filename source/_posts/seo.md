---
title:  native-js
date: {{ date }}
tags:
---

节后好摸鱼，借此总结一下前段时间做的一些seo相关的工作
Google搜索的文档链接： https://developers.google.com/search/docs

<!-- more -->
1.网站地图文件（sitemap.xml）
作为一个新网站，sitemap.xml对于Google 等搜索引擎的抓取非常有用；
sitemap.xml文档放在站点的根路径。

简单的栗子
```
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://m.myatoto.com</loc>
        <lastmod>2023-05-10T15:02:24.021Z</lastmod>
    </url>
</urlset>
```

2.正确使用a标签跳转，不要使用js做跳转

3.国际化
采用特定国家/地区网域：
example.de
或
example.com/de/

nextjs默认提供这两种配置可供选择

4.使用好meta标签，优化description、keywords等内容
```
<meta name="viewport" content="...">  // 表明该网页适合移动设备

```

5.首页尽量减少弹窗，交互设计上能一次展示的内容尽量一次展示，爬虫不会执行js去触发弹窗动作

6.使用服务端渲染或静态页面，spa项目的seo支持很差