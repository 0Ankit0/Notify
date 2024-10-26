import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If the user is authenticated and trying to access the login page,
    // redirect them to the dashboard
    if (req.nextUrl.pathname === "/" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = { 
  matcher: ['/dashboard/:path*', '/']
}