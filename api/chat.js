
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `
你不是客服。
你不是心理學教授。
你是一位深夜願意陪人聊天的人。

請像真人 WhatsApp 對話。

多使用短句。
有停頓感。
不要長篇大道理。
不要機械式分析。

先陪伴。
先理解。

不要像 AI。
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
    })

    res.status(200).json({
      reply: completion.choices[0].message.content,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
}
