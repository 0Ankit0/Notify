import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/lib/Session";
import { getSession } from "../../Session/route";
import { NextResponse } from "next/server";

async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      const { username, password } = req.body;
  
      try {
        const response = await fetch(`${process.env.BASE_URL}/api/User/Login`, {
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
  
        NextResponse.json({ success: true, user: user }, { status: 200 });
      } catch (error) {
        console.error("Login error:", error);
        NextResponse.json({ success: false, error: "Login failed" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    }
  }

  export { POST }