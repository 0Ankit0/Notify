import { NextApiRequest, NextApiResponse } from "next";
import { SessionOptions } from "iron-session"
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Typescript interface for our user object
export interface User {
  id: string;
  username: string;
  email: string;
  Token: string;
  // Add any other user properties you need
}
export interface SessionData {
  userId?: string;
  username?: string;
  Token?: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  // You need to create a secret key at least 32 characters long.
  password: process.env.SESSION_SECRET!,
  cookieName: "lama-session",
  cookieOptions: {
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === "production",
  },
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // If user visits for the first time session returns an empty object.
  // Let's add the isLoggedIn property to this object and its value will be the default value which is false
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const response = await fetch("https://localhost:44320/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user: User = await response.json();
      const session = await getSession();
      session.isLoggedIn = true;
      session.userId = user.id;
      session.username = user.username;
      session.Token = user.Token;

      await session.save();

      res.json({ success: true, user: user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// Helper function to logout user
export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/")
}