
import { NextResponse } from "next/server"
import { auth } from "../../auth"



export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    return { error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) }
  }
  return { user: session.user, error: null }
}

export async function requireAdmin() {
  const { user, error } = await requireAuth()
  if (error) return { error }
  if (user.role !== "admin") {
    return { error: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }) }
  }
  return { user, error: null }
}