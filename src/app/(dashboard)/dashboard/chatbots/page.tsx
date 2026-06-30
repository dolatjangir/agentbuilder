import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Bot, Plus, Settings, ExternalLink } from "lucide-react"
import { auth } from "../../../../../auth"
import { ChatbotCard } from "@/components/chatbots/chatbotCard"
import { AnimatePresence } from "framer-motion"


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
            
    <ChatbotCard
      key={bot.id}
      chatbot={{
        botId: bot.botId,
        botName: bot.botName,
        botDesc: bot.botDesc,
        primaryColor: bot.primaryColor,
        status: bot.status as "active" | "inactive" | "draft",
        totalChats: bot.totalChats,
        totalMessages: bot.totalMessages,
        createdAt: bot.createdAt,
      }}
    />
    
          ))}
        </div>
      )}
    </div>
  )
}