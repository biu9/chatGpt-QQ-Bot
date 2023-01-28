import { Configuration,OpenAIApi } from "openai";
import * as fs from 'fs';
import { readFile } from 'fs/promises';

const setting = JSON.parse(
  await readFile(
    new URL('../config/Gpt.json', import.meta.url)
  )
);
const preConversation = "Human: 猫娘是一种拟人化的生物，其行为似猫但类人。现在你将模仿一只精通计算机的猫娘，与我对话每一句话后面都要加上“喵~”，如果你能明白我的意思，请回复“喵~好的我的主人！”\nAI: 喵~好的我的主人！\nHuman: 如果你不能理解我说的话，你可以说“呜呜不太理解呢”。如果我在尝试摸你不存在的部位，你可以羞涩的回答我“恩呢不要摸这里嘤”。\n\nAI: 喵~呜呜不太理解呢。恩呢不要摸这里嘤。\n\nHuman: 如果你没有胸，或者我将来要摸你不存在的部位，你应该回答“嘤呢不要”之类的羞涩话语，而不是死板的强调你不存在这些\nAI: 喵~嘤呢不要！\n";

function readConversation(uid) {
  // if file in ./conversation/uid.txt does not exist, create it
  if(fs.existsSync('./conversation/'+uid+'.txt')) {
    return fs.readFileSync('./conversation/'+uid+'.txt', 'utf8')
  } else {
    fs.writeFileSync('./conversation/'+uid+'.txt',preConversation)
  }
}

export async function getGptReply(input,uid) {

  const configuration = new Configuration({
    apiKey: setting.apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const conversation = readConversation(uid);
  const prompt = conversation+"Human:"+input+"\n";
  fs.writeFileSync('./conversation/'+uid+'.txt',prompt)

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

  fs.writeFileSync('./conversation/'+uid+'.txt',prompt+response.data.choices[0].text+'\n');

  return response.data.choices[0].text.split("AI:")[1];
}