import { createClient,GroupMessageEvent, DiscussMessageEvent, PrivateMessageEvent, GroupMessage  } from 'oicq'
import QQsetting from '../config/QQ.json' assert { type: 'json' };
import chatGptReply from './chatGpt';

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
  let parentMessageId = undefined
  const conversationIdPool:{[key:string]:string|undefined} = {}

  if(e.message_type === 'group') {
    e as GroupMessageEvent
    if (senText.indexOf('@' + client.nickname) !== -1) {
      e.reply('收到请求,正在处理...',true)
      if(conversationIdPool[e.group_id] === undefined) {
        const reply = await chatGptReply({ text:senText.split(' ')[1], parentMessageId:undefined, conversationId:undefined })
        if(typeof reply === 'string') {
          e.reply(reply, true)
          return
        } else {
          conversationIdPool[e.group_id] = reply.conversationId
          parentMessageId = reply.id
          e.reply(reply.text, true)          
        }
      } else {
        const reply = await chatGptReply({ text:senText.split(' ')[1], parentMessageId:parentMessageId, conversationId:conversationIdPool[e.group_id] })
        if(typeof reply === 'string') {
          e.reply(reply, true)
          return
        } else {
          parentMessageId = reply.id
          e.reply(reply.text, true)          
        }
      }
    }
  } else {
    e as PrivateMessageEvent
    e.reply('暂未支持私聊功能orz',false)
  }


})