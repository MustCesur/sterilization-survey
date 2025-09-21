import OpenAI from 'openai'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateReport(prompt){
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800
  })
  return res.choices?.[0]?.message?.content ?? ''
}
