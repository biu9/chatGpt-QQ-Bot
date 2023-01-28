import { createClient } from 'oicq'
import { readFile } from 'fs/promises'
import { getGptReply } from './Gpt.js'

const QQsetting = JSON.parse(await readFile(new URL('../config/QQ.json', import.meta.url)))

const account = QQsetting.account
const client = createClient(account)

client.on('system.online', async () => {
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
    const reply = await getGptReply(senText.split(' ')[1], e.user_id)
    e.reply(reply, true)
  }
})