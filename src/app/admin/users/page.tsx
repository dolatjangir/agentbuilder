import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Users, Shield, User } from "lucide-react"
import { auth } from "../../../../auth"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/dashboard")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { chatbots: true, projects: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <p className="text-text-muted mt-1">Manage platform users</p>
      </div>

      <div className="rounded-2xl border border-border-card bg-bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-elevated/50 border-b border-border-default">
            <tr>
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-4">User</th>
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-4">Role</th>
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-4">Chatbots</th>
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-4">Projects</th>
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-bg-glass-hover transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center">
                      <span className="text-sm font-bold text-text-primary">{u.name?.[0] || u.email[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{u.name || "No name"}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-error/10 text-error border border-error/20"
                      : "bg-brand/10 text-brand border border-brand/20"
                  }`}>
                    {u.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">{u._count.chatbots}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{u._count.projects}</td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}