const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  const survey = await prisma.survey.create({
    data: {
      title: 'Annual Sterilization & Hygiene Survey 2025',
      description: 'Ministry of Health standard questionnaire',
      questions: {
        create: [
          { text: 'Are hand hygiene stations available when needed?', order: 1 },
          { text: 'Are sterilization procedures followed correctly?', order: 2 },
          { text: 'Is equipment cleaned according to protocol?', order: 3 },
          { text: 'Are staff trained regularly on hygiene?', order: 4 },
          { text: 'Is waste disposed of correctly?', order: 5 }
        ]
      }
    }
  })
  console.log('Seeded survey id:', survey.id)
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
