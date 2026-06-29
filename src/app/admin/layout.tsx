
import { redirect } from "next/navigation"

import { auth } from "../../../auth"
import { AdminSidebar } from "./_components/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/dashboard")

  return (
    <div className="min-h-screen bg-bg-base flex">
      <AdminSidebar user={session.user} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-bg-card/50 border-b border-border-default flex items-center px-6">
          <h1 className="text-lg font-bold text-text-primary">Admin Panel</h1>
          <span className="ml-3 px-2 py-0.5 rounded-md bg-error/10 text-error text-xs font-medium">
            ADMIN
          </span>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}