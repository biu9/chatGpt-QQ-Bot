## chatGpt-QQ-Bot

### 概览

该项目基于QIQC以及chatGpt提供的api搭建了qq机器人,使用时需要`@${bot-nickname} ${your question}`来发送请求

### 运行

0. 项目运行在node环境下
1. npm install安装依赖
2. 在config中参照chatGpt-sample.json建立chatGpt.json文件
   1. 获取__Secure-next-auth.session-token:
      ![20221209192450](https://typora-1309407228.cos.ap-shanghai.myqcloud.com/20221209192450.png)
3. 运行node main.js开启bot

### TODO

1. 代码架构的优化
2. chatGpt预加载性格
3. 功能扩展