import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/lib/Session";
import { getSession } from "../../Session/route";
import { NextResponse } from "next/server";

// Helper function to logout user
async function Logout(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const session = await getSession();
        session.destroy();
       
       return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    }
}

    export {  Logout }