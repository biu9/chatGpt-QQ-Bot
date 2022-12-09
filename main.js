import { createClient } from 'oicq'
import { getChatGPTReply } from './chatGpt.js'
import { ChatGPTAPI } from 'chatgpt'
import { readFile } from 'fs/promises'
import { catCharacter } from './characters/cat.js' 

const setting = JSON.parse(await readFile(new URL('./config/chatGpt.json', import.meta.url)))
const QQsetting = JSON.parse(await readFile(new URL('./config/QQ.json', import.meta.url)))

// 定义ChatGPT的配置
const config = {
  markdown: true, // 返回的内容是否需要markdown格式
  AutoReply: true, // 是否自动回复
  sessionToken: setting['__Secure-next-auth.session-token'], // ChatGPT的sessionToken
}

const api = new ChatGPTAPI(config)
const conversation = api.getConversation()

const account = QQsetting.account
const client = createClient(account)

async function preModify(conversation,type) {
  switch (type) {
    case 'cat':
      await catCharacter(conversation)
      break
    default:
      break
  }
}

client.on('system.online', async () => {
  await preModify(conversation,'cat')
  console.log('小助手加载成功!')
})

client.on('system.login.qrcode', function (e) {
  //扫码后按回车登录
  process.stdin.once('data', () => {
    this.login()
  })
}).login()

client.on('message', async (e) => {
  const senText = e.raw_message

  if (senText.indexOf('@' + client.nickname) !== -1) {
    const answer = await getChatGPTReply(
      e.raw_message.split(' ')[1],
      conversation,
    )
    e.reply(answer, true)
  }
})