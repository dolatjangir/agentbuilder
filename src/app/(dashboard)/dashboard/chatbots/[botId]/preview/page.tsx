"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, ArrowLeft, MessageSquare, ExternalLink, Copy, Check } from "lucide-react"
import Link from "next/link"
import { ChatPreview } from "../../_components/chatPreview"
import { use } from "react"

export default function PreviewChatbotPage({ params }: { params: Promise<{ botId: string }> }) {
 const { botId } = use(params)
  
  const [isLoading, setIsLoading] = useState(true)
  const [chatbot, setChatbot] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Fetch chatbot data
  useEffect(() => {
    async function fetchChatbot() {
      try {
        const res = await fetch(`/api/chatbots/${botId}`)
        const data = await res.json()
        
        if (!data.success) {
          setError(data.error || "Chatbot not found")
          return
        }
        
        setChatbot(data.data)
      } catch {
        setError("Failed to load chatbot")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchChatbot()
  }, [botId])

  const embedCode = `<script src="https://yourdomain.com/widget.js?id=${botId}" data-color="${chatbot?.primaryColor}" data-position="${chatbot?.widgetPos}"></script>`
  const publicUrl = `https://yourdomain.com/chat/${botId}`

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-error">{error}</p>
        <Link href="/dashboard/chatbots" className="mt-4 text-brand hover:underline">
          Back to Chatbots
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/chatbots/${botId}`}
                className="p-2 rounded-lg bg-bg-glass border border-border-glass text-text-secondary hover:text-text-primary transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_-5px_var(--brand-glow)]">
                <Bot className="w-5 h-5 text-text-on-brand" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">
                  Preview: {chatbot?.botName}
                </h1>
                <p className="text-xs text-text-muted hidden sm:block">
                  Test your chatbot and get integration code
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/chatbots/${botId}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary bg-bg-glass border border-border-glass rounded-xl hover:bg-bg-glass-hover transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel — Integration Info */}
          <div className="w-full lg:w-[40%] space-y-6">
            {/* Chatbot Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-border-card bg-bg-card"
            >
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                Chatbot Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Name</span>
                  <span className="text-sm text-text-primary font-medium">{chatbot?.botName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Provider</span>
                  <span className="text-sm text-text-primary font-medium capitalize">{chatbot?.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Model</span>
                  <span className="text-sm text-text-primary font-medium">{chatbot?.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Status</span>
                  <span className={`text-sm font-medium ${
                    chatbot?.status === "active" ? "text-success" : "text-warning"
                  }`}>
                    {chatbot?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Total Messages</span>
                  <span className="text-sm text-text-primary font-medium">{chatbot?.totalMessages}</span>
                </div>
              </div>
            </motion.div>

            {/* Embed Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-border-card bg-bg-card"
            >
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                Embed Script
              </h3>
              <div className="bg-bg-code border border-border-code rounded-xl p-4 mb-4 overflow-x-auto">
                <pre className="text-xs text-text-code font-mono whitespace-pre-wrap break-all">
                  {embedCode}
                </pre>
              </div>
              <button
                onClick={copyEmbed}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-text-on-brand text-sm font-medium hover:bg-brand-hover transition-all"
              >
                {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedEmbed ? "Copied!" : "Copy Embed Code"}
              </button>
            </motion.div>

            {/* Public URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-border-card bg-bg-card"
            >
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                Public URL
              </h3>
              <div className="bg-bg-code border border-border-code rounded-xl p-4 mb-4 overflow-x-auto">
                <code className="text-xs text-text-code font-mono break-all">
                  {publicUrl}
                </code>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyUrl}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-glass border border-border-glass text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover transition-all"
                >
                  {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedUrl ? "Copied!" : "Copy URL"}
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-text-on-brand text-sm font-medium hover:bg-brand-hover transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Panel — Live Preview */}
          <ChatPreview
            botName={chatbot?.botName}
            avatarUrl={chatbot?.avatarUrl || ""}
            primaryColor={chatbot?.primaryColor}
            welcomeMsg={chatbot?.welcomeMsg}
            questions={chatbot?.questions.map((q: any) => q.question)}
            botId={botId}
          />
        </div>
      </div>
    </div>
  )
}