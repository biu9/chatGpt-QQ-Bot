## chatGpt-QQ-Bot

### 概览

该项目基于OIQC以及openai提供的api搭建了qq机器人,使用时需要`@${bot-nickname} ${your question}`来发送请求

使用演示:

![20230128234339](https://typora-1309407228.cos.ap-shanghai.myqcloud.com/20230128234339.png)

### 运行

0. 项目运行在node环境下
1. npm install安装依赖
2. 在config中参照Gpt-sample.json建立Gpt.json文件
3. 获取apiKey并输入(需要在openai官网获取)

### 更新日志

2023.2.18: 
- 使用chatgpt-api库替代官方api以突破对话上下文限制
- 使用ts重写(在node里面用ts真是一场灾难...)

### TODO

0. ~~突破对话上下文长度限制~~
1. 代码架构的优化
2. chatGpt预加载性格
3. 功能扩展
4. 群消息可能被风控error