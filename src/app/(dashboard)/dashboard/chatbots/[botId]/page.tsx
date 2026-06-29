"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bot, Save, ArrowLeft, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { ChatbotForm } from "../_components/chatbotForm"
import { ChatPreview } from "../_components/chatPreview"
import { use } from "react" 

export default function EditChatbotPage({ params }: { params: Promise<{ botId: string }> }) {
  const router = useRouter()
 const { botId } = use(params)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [chatbot, setChatbot] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [error, setError] = useState("")

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
         const bot = data.data
        setChatbot(bot)
        setFormData({
            ...bot,
                 questions: bot.questions.map((q: any) => q.question)
        })
      } catch {
        setError("Failed to load chatbot")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchChatbot()
  }, [botId])

  const handleSave = async (data: any) => {
    setIsSaving(true)
    setIsSaved(false)

    try {
      const res = await fetch(`/api/chatbots/${botId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        setIsSaved(true)
        setFormData(data)
        setTimeout(() => setIsSaved(false), 2000)
      } else {
        alert(result.error || "Failed to save")
      }
    } catch {
      alert("Network error")
    } finally {
      setIsSaving(false)
    }
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
                href="/dashboard/chatbots"
                className="p-2 rounded-lg bg-bg-glass border border-border-glass text-text-secondary hover:text-text-primary transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_-5px_var(--brand-glow)]">
                <Bot className="w-5 h-5 text-text-on-brand" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">
                  Edit Chatbot
                </h1>
                <p className="text-xs text-text-muted hidden sm:block">
                  {chatbot?.botName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isSaved && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-success text-text-on-brand rounded-xl">
                  <Check className="w-4 h-4" />
                  Saved
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ChatbotForm
            initialData={{
              botName: chatbot.botName,
              botDesc: chatbot.botDesc || "",
              provider: chatbot.provider,
              model: chatbot.model,
              systemPrompt: chatbot.systemPrompt,
              responseStyle: chatbot.responseStyle,
              welcomeMsg: chatbot.welcomeMsg,
              questions: chatbot.questions.map((q: any) => q.question),
              primaryColor: chatbot.primaryColor,
              widgetPos: chatbot.widgetPos,
              widgetTitle: chatbot.widgetTitle,
              avatarUrl: chatbot.avatarUrl || "",
            }}
            onSubmit={handleSave}
            isSubmitting={isSaving}
            submitLabel="Save Changes"
          />

          <ChatPreview
            botName={formData?.botName || chatbot.botName}
            avatarUrl={formData?.avatarUrl || chatbot.avatarUrl || ""}
            primaryColor={formData?.primaryColor || chatbot.primaryColor}
            welcomeMsg={formData?.welcomeMsg || chatbot.welcomeMsg}
           questions={formData?.questions || chatbot?.questions?.map((q: any) => q.question) || []}
            botId={botId}
          />
        </div>
      </div>
    </div>
  )
}