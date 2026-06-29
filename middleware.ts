
import { NextResponse } from "next/server"
import { auth } from "./auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth?.user
  const role = req.auth?.user?.role
  const pathname = nextUrl.pathname

  // Public routes
  const isPublic = ["/login", "/register"].some(p => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Admin trying to access user routes → redirect to admin
  if (role === "admin" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin", nextUrl))
  }

  // User trying to access admin routes → redirect to dashboard
  if (role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}