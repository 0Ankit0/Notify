import { SessionOptions } from "iron-session"
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// Typescript interface for our user object
export interface User {
    id: string;
    username: string;
    email: string;
    Token: string;
  }
  export interface SessionData {
    userId?: string;
    username?: string;
    Token?: string;
    isLoggedIn: boolean;
  }
  
  export const sessionOptions: SessionOptions = {
    // You need to create a secret key at least 32 characters long.
    password: process.env.NEXT_PUBLIC_SESSION_SECRET!,
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
  