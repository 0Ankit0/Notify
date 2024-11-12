import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/utils/loginSchema";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    // Validate the credentials using the loginSchema
                    const validatedCredentials = loginSchema.parse(credentials);
                    // Static check for hardcoded user credentials
                    var apiUrl = process.env.NOTIFY_API_URL || "http://localhost:44320/api";
                    apiUrl += "/User/login";
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(validatedCredentials),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { id: data.userId, name: data.userName, email: data.userEmail };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                name: token.name,
                email: token.email,
            };
            return session;
        },
    },
    session: {
        strategy: "jwt", // Use JWT strategy for credentials provider
    },
});

export { handler as GET, handler as POST };
