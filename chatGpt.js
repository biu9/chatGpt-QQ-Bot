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

export async function getChatGPTReply(content,conversation) {
  const api = new ChatGPTAPI(config);
  await api.ensureAuth();
  
  const res = await conversation.sendMessage(content);
  return res;
}