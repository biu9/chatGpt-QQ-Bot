import { createClient } from "oicq"
import { getChatGPTReply } from './chatGpt.js'
import { ChatGPTAPI } from 'chatgpt';
import { readFile } from 'fs/promises';

const setting = JSON.parse(
  await readFile(
    new URL('./config/chatGpt.json', import.meta.url)
  )
);

// 定义ChatGPT的配置
const config = {
    markdown: true, // 返回的内容是否需要markdown格式
    AutoReply: true, // 是否自动回复
    sessionToken: setting['__Secure-next-auth.session-token'], // ChatGPT的sessionToken
};

const api = new ChatGPTAPI(config);
const conversation = api.getConversation();

//const { createClient } = require("oicq")
const account = 2517943939
const client = createClient(account)

client.on("system.online", () => console.log("Logged in!"))
client.on("message", async e => {
 // console.log(e);
 const senText = e.raw_message;
 if(senText.indexOf('@'+client.nickname) !== -1) {
    // e.reply(e.raw_message.split(' ')[1], true)   
    const answer = await getChatGPTReply(e.raw_message.split(' ')[1],conversation); 
    console.log(answer);
    e.reply(answer, true)
 }
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()