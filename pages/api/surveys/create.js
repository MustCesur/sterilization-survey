import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { title, description, questions } = body

    if (!title || !questions?.length) {
      return res.status(400).json({ error: 'Missing title or questions' })
    }

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map((q, idx) => ({
            text: q,
            order: idx + 1
          }))
        }
      },
      include: { questions: true }
    })

    res.json(survey)
  } catch (e) {
    console.error('Error creating survey:', e)
    res.status(500).json({ error: 'Error creating survey' })
  }
}
