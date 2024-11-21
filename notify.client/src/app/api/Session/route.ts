import { NextApiRequest, NextApiResponse } from "next";
import { SessionOptions } from "iron-session"
import { getIronSession } from "iron-session";
import { SessionData,defaultSession,sessionOptions } from "@/lib/Session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // If user visits for the first time session returns an empty object.
  // Let's add the isLoggedIn property to this object and its value will be the default value which is false
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}
async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession();
  if(!session.isLoggedIn){
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return NextResponse.json(session);
}

//To set the session
async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession();
    const user = req.body;
    session.username = user.username;
    session.Token = user.Token;
    session.isLoggedIn = true;
  
    await session.save();
    return NextResponse.json(session);
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.error();
    
  }
 
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession();
  session.isLoggedIn = false;
  session.destroy();
  return NextResponse.redirect("/");
}

export {GET,DELETE,POST}