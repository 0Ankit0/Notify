import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { loginSchema } from "@/utils/loginSchema"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          // Validate the credentials using the loginSchema
          const validatedCredentials = loginSchema.parse(credentials)

          // Here you would typically check these credentials against your database
          // For this example, we'll just check for a hardcoded user
          if (validatedCredentials.username === "admin" && validatedCredentials.password === "admin123") {
            return { id: "1", name: validatedCredentials.username, email: "user@example.com" }
          } else {
            return null
          }
        } catch (error) {
          console.error("Validation error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email
        session.user.name = token.name
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }