"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Edit, ExternalLink, Users } from "lucide-react"
import { DeleteChatbot } from "./deleteChatbot"

interface Chatbot {
  botId: string
  botName: string
  botDesc?: string | null
  primaryColor: string
  status: "active" | "inactive" | "draft"
  totalChats?: number | null
  totalMessages?: number | null
  createdAt: string | Date
}

interface ChatbotCardProps {
  chatbot: Chatbot
  onDeleted?: () => void
}

export function ChatbotCard({ chatbot, onDeleted }: ChatbotCardProps) {
  const router = useRouter()

  const statusColors = {
    active: "bg-success/10 text-success border-success/20",
    inactive: "bg-text-muted/10 text-text-muted border-text-muted/20",
    draft: "bg-warning/10 text-warning border-warning/20",
  }

  const handleDeleted = () => {
    router.refresh()
    onDeleted?.()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl border border-border-card bg-bg-card p-6 hover:bg-bg-glass-hover hover:border-border-glass transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: chatbot.primaryColor }}
          >
            {chatbot.botName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary truncate">{chatbot.botName}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[chatbot.status]}`}>
              {chatbot.status}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-muted mb-4 line-clamp-2">
        {chatbot.botDesc || "No description"}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-5 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          <span>{chatbot.totalMessages || 0} messages</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{chatbot.totalChats || 0} chats</span>
        </div>
      </div>

   {/* Actions */}
<div className="flex items-center gap-2 pt-4 border-t border-border-default">
  <Link
    href={`/dashboard/chatbots/${chatbot.botId}`}
    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand bg-brand/10 border border-brand/20 hover:bg-brand/20 transition-colors"
  >
    <Edit className="w-4 h-4" />
    Edit
  </Link>
  <Link
    href={`/chat/${chatbot.botId}`}
    target="_blank"
    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary bg-bg-glass border border-border-glass hover:text-text-primary hover:bg-bg-glass-hover transition-all"
  >
    <ExternalLink className="w-4 h-4" />
    Preview
  </Link>
  <DeleteChatbot
    botId={chatbot.botId}
    botName={chatbot.botName}
    onDeleted={handleDeleted}
  />
</div>
    </motion.div>
  )
}