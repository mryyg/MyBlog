---
title:  nextjs多环境配置、多语言以及自动化构建和部署
date: {{ date }}
tags:
---

nextjs多环境配置、多语言以及自动化构建和部署

<!-- more -->

1.多环境配置我是用的dotenv-cli这个插件，只需要在根目录创建对应的.env文件（如.env.test/.env.production）,然后配置对应的打包和启动命令就好；

```
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:test": "dotenv -e .env.test next build",
    "build:dev": "dotenv -e .env.dev next build",
    "start": "next start",
    "start:test": "dotenv -e .env.test next start",
    "start:dev": "dotenv -e .env.dev next start",
    "lint": "next lint"
  },
```


2.多语言是使用的next-i18next这个插件，看文档操作就行
https://github.com/i18next/next-i18next
语言包这块，我们公司是有文案组去翻译，给个在线表格的模版她们，然后将翻译好的表格给我导入，导入用nodejs写了个脚本;
```

var xlsx = require('node-xlsx');
var fs = require('fs');
const path = require('path')

const fileName = ['en', 'zh', 'ja', 'de', 'fr', 'it', 'es', 'ru', 'nl', 'pl', 'sv', 'tr','pt','zh_TW']

const fileMap = fileName.reduce((pre, cur) => {
    pre[cur] = {}
    return pre
},{})

try {
  var tableData = xlsx.parse(path.join(__dirname, './lang.xlsx'));

  tableData[0].data?.forEach(row => {
    row.forEach((col, index) => {
      // 第一列为key
      if (index === 0) return
      fileMap[fileName[index-1]][row[0]] = col
    })
  })

  fileName.forEach((name) => {
    fs.writeFile(
      path.join(__dirname, `${name}.json`),
      JSON.stringify(fileMap[name]),
      function (err) {
        if (err) {
          throw err
        }
        console.log('save') //文件被保存
      },
    )
  })

} catch (error) {
  console.log(error, 111)
}

```

3.自动化构建和部署用的Jenkins
Jenkins用的不熟，简单配置，先配置仓库地址和分支，然后跑shell命令构建

```
echo "start......."
cd /var/jenkins_home/workspace/atoto-mall-mobile
docker rmi -f atoto-mall-mobile:1.0.0
docker build -t atoto-mall-mobile:1.0.0 .
docker rm -f atoto-mall-mobile
docker run -d -p 3033:3000 --name atoto-mall-mobile atoto-mall-mobile:1.0.0
echo "创建容器并启动成功！"
```

docker也用的不熟，简单写了个Dockerfile,放项目根目录

```
# 基础镜像
FROM node:16.17.0

# 设置工作目录
WORKDIR /app

# 将项目文件复制到工作目录
COPY . /app

# 安装依赖项

RUN yarn

RUN npm run build:dev

# 暴露端口（根据需要）
EXPOSE 3000

# 启动应用程序
CMD [ "npm", "run", "start:dev" ]
```
 然后就是nginx的配置，将80端口和对应路径转发到3033端口