const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main(){
  const pass = await bcrypt.hash('Password123!', 10)
  const user = await prisma.user.upsert({ 
    where: { email: 'admin@hospital.local' }, 
    update: {}, 
    create: { email: 'admin@hospital.local', name: 'Admin', password: pass, role: 'admin' } 
  })
  console.log('Admin user created:', user.email)
}
main()
  .catch(e=>{console.error(e); process.exit(1)})
  .finally(()=> prisma.$disconnect())
