import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { title, description, questions } = req.body

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
    console.error(e)
    res.status(500).json({ error: 'Error creating survey' })
  }
}
