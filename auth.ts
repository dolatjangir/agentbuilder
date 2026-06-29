import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"


export const authOptions = {
 session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
   trustHost: true,
    secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        
        if (!user) return null
        
        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null
        
        return { id: user.id, 
          email: user.email,
           name: user.name,
            role: user.role }
      }
    })
  ],
  callbacks: {
     jwt: ({ token, user }: { token: any; user: any }) => {
      if (user) {
        token.sub = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
      }
      return token
    },
   session: ({ session, token }: { token: any; session: any }) => {
      session.user.id = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name as string
      session.user.email = token.email as string
      return session
    }
  },
  pages: {
    signIn: "/login",
    
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)