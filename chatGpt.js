import { ChatGPTAPI } from 'chatgpt';
import { readFile } from 'fs/promises';
import log4js from 'log4js';

const logger = log4js.getLogger('chatGpt');

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

export async function getChatGPTReply(content,conversation) {
  const api = new ChatGPTAPI(config);
  let res = '';

  await api.ensureAuth();
  
  try {
    res = await conversation.sendMessage(content);
  } catch {
    err => {
      console.log(err);
      res = 'ChatGPT出现了一些问题...';
      logger.error(err);
    }
  }
  
  return res;
}