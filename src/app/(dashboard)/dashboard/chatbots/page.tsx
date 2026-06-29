import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Bot, Plus, Settings, ExternalLink } from "lucide-react"
import { auth } from "../../../../../auth"


export default async function ChatbotsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const chatbots = await prisma.chatbot.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { questions: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Chatbot Maker</h1>
          <p className="text-text-muted mt-1">Build and manage AI chatbots</p>
        </div>
        <Link
          href="/dashboard/chatbots/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-text-on-brand font-medium text-sm hover:bg-brand-hover transition-all"
        >
          <Plus className="w-4 h-4" />
          New Chatbot
        </Link>
      </div>

      {chatbots.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-border-card text-center">
          <Bot className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary">No chatbots yet</h3>
          <p className="text-text-muted mt-1 mb-4">Create your first AI assistant</p>
          <Link
            href="/dashboard/chatbots/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-text-on-brand font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Chatbot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbots.map((bot) => (
            <div
              key={bot.id}
              className="p-6 rounded-2xl border border-border-card bg-bg-card hover:bg-bg-glass-hover transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand" />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  bot.status === "active"
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-warning/10 text-warning border border-warning/20"
                }`}>
                  {bot.status}
                </span>
              </div>
              <h3 className="font-semibold text-text-primary">{bot.botName}</h3>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">{bot.botDesc}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                <span>{bot.provider}</span>
                <span>•</span>
                <span>{bot.model}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-default">
                <Link
                  href={`/dashboard/chatbots/${bot.botId}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-bg-glass border border-border-glass text-sm text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Edit
                </Link>
                <Link
                  href={`/dashboard/chatbots/${bot.botId}/preview`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand/10 border border-brand/20 text-sm text-brand hover:bg-brand/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}