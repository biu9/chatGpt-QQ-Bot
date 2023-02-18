import { ChatGPTAPI, ChatMessage } from 'chatgpt'
import settings from '../config/Gpt.json' assert { type: 'json' };

const api = new ChatGPTAPI({
  apiKey: settings.apiKey
})

export default async function chatGptReply({ text, conversationId = undefined, parentMessageId }: { text: string, conversationId: string | undefined, parentMessageId: string | undefined }): Promise<string | ChatMessage> {
  try {
    const response: ChatMessage = await api.sendMessage(text, {
      conversationId: conversationId,
      parentMessageId: parentMessageId
    })

    return response    
  } catch {
    (err: any) => {
      console.log(err)
      return '出错了'
    }
  }

  return '出错了'
}