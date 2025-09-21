const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const newEmail = 'asli@asli.com'
  const newPassword = 'asli'
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Check if a user already exists with this email
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail }
  })

  if (existingUser) {
    // Update the password (and optionally name/role)
    const updatedUser = await prisma.user.update({
      where: { email: newEmail },
      data: { 
        password: hashedPassword,
        name: 'Asli',   // optional
        role: 'admin'   // optional
      }
    })
    console.log('Existing user updated:', updatedUser.email)
  } else {
    // Create a new user if not found
    const user = await prisma.user.create({
      data: {
        email: newEmail,
        password: hashedPassword,
        name: 'Asli',
        role: 'admin'
      }
    })
    console.log('New user created:', user.email)
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
