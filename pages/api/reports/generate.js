import prisma from '../../../lib/prisma'
import { generateReport } from '../../../lib/openai'

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const { surveyId } = req.body
  try{
    const survey = await prisma.survey.findUnique({ where: { id: surveyId }, include: { questions: true } })
    if(!survey) return res.status(404).json({ error: 'survey not found' })

    const stats = []
    for(const q of survey.questions){
      const answers = await prisma.answer.findMany({ where: { questionId: q.id } })
      const values = answers.map(a=> a.value)
      const count = values.length || 0
      const mean = count ? (values.reduce((s,n)=> s+n,0)/count) : 0
      const distribution = [1,2,3,4,5].map(opt => ({ option: opt, pct: count ? (values.filter(v=> v===opt).length / count * 100).toFixed(1) : '0.0' }))
      stats.push({ question: q.text, count, mean: mean.toFixed(2), distribution })
    }

    let prompt = `Survey title: ${survey.title}. Stats: ${JSON.stringify(stats)}. Create professional hospital hygiene report.`
    const aiText = await generateReport(prompt)
    const report = await prisma.report.create({ data: { surveyId, content: aiText } })
    return res.json({ id: report.id, content: aiText })
  }catch(e){
    console.error(e)
    return res.status(500).json({ error: 'report error' })
  }
}
