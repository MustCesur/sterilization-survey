import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials){
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if(!user) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if(!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }){
      if(user) token.role = user.role
      return token
    },
    async session({ session, token }){
      session.user.role = token.role
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})
