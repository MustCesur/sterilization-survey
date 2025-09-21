import prisma from '../../../lib/prisma'

export default async function handler(req,res){
  if(req.method === 'GET'){
    const surveys = await prisma.survey.findMany({ include: { questions: true }, orderBy: { createdAt: 'desc' } })
    return res.json(surveys)
  }
  if(req.method === 'POST'){
    try{
      const { surveyId, answers, userEmail } = req.body
      let user = null
      if(userEmail){
        user = await prisma.user.findUnique({ where: { email: userEmail } })
      }
      const response = await prisma.response.create({
        data: {
          surveyId,
          userId: user?.id,
          answers: { create: Object.entries(answers).map(([questionId, value]) => ({ questionId, value: Number(value) })) }
        },
        include: { answers: true }
      })
      return res.json({ ok: true, id: response.id })
    }catch(e){
      console.error(e)
      return res.status(500).json({ error: 'db error' })
    }
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
