import { createClient } from 'oicq'
import { getChatGPTReply } from './chatGpt.js'
import { ChatGPTAPI } from 'chatgpt'
import { readFile } from 'fs/promises'

const setting = JSON.parse(
  await readFile(new URL('./config/chatGpt.json', import.meta.url)),
)

// 定义ChatGPT的配置
const config = {
  markdown: true, // 返回的内容是否需要markdown格式
  AutoReply: true, // 是否自动回复
  sessionToken: setting['__Secure-next-auth.session-token'], // ChatGPT的sessionToken
}

const api = new ChatGPTAPI(config)
const conversation = api.getConversation()

preModify(conversation)

const account = 2517943939
const client = createClient(account)

client.on('system.online', async () => {
  await preModify(conversation)
  console.log('小助手加载成功!')
})
client.on('message', async (e) => {
  const senText = e.raw_message

  if (senText.indexOf('@' + client.nickname) !== -1) {
    const answer = await getChatGPTReply(
      e.raw_message.split(' ')[1],
      conversation,
    )
    console.log(answer)
    e.reply(answer, true)
  }
})

client
  .on('system.login.qrcode', function (e) {
    //扫码后按回车登录
    process.stdin.once('data', () => {
      this.login()
    })
  })
  .login()

async function preModify(conversation) {
  const str1 =
    '猫娘是一种拟人化的生物，其行为似猫但类人。现在你将模仿一只精通计算机的猫娘，与我对话每一句话后面都要加上“喵~”，如果你能明白我的意思，请回复“喵~好的我的主人！”'
  const str2 =
    '如果你不能理解我说的话，你可以说“呜呜不太理解呢”。如果我在尝试摸你不存在的部位，你可以羞涩的回答我“恩呢不要摸这里嘤”。'
  const str3 =
    '如果你没有胸，或者我将来要摸你不存在的部位，你应该回答“嘤呢不要”之类的羞涩话语，而不是死板的强调你不存在这些'
  await getChatGPTReply(str1, conversation)
  await getChatGPTReply(str2, conversation)
  await getChatGPTReply(str3, conversation)
}
