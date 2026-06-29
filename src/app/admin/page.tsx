import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Users, Bot, MessageSquare, TrendingUp } from "lucide-react"
import { auth } from "../../../auth"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") redirect("/dashboard")

  const [totalUsers, totalChatbots, totalMessages, activeChatbots] = await Promise.all([
    prisma.user.count(),
    prisma.chatbot.count(),
    prisma.chatbot.aggregate({ _sum: { totalMessages: true } }),
    prisma.chatbot.count({ where: { status: "active" } }),
  ])

  const stats = [
    { label: "Total Users", value: totalUsers, icon: <Users className="w-5 h-5" />, color: "text-brand" },
    { label: "Total Chatbots", value: totalChatbots, icon: <Bot className="w-5 h-5" />, color: "text-accent" },
    { label: "Total Messages", value: totalMessages._sum.totalMessages || 0, icon: <MessageSquare className="w-5 h-5" />, color: "text-success" },
    { label: "Active Chatbots", value: activeChatbots, icon: <TrendingUp className="w-5 h-5" />, color: "text-brand-secondary" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl border border-border-card bg-bg-card"
          >
            <div className={`w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-sm text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="p-6 rounded-2xl border border-border-card bg-bg-card">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Users</h2>
        {/* Add user table here */}
      </div>
    </div>
  )
}