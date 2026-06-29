"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bot, Save, Sparkles, Check, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ChatPreview } from "../_components/chatPreview"
import { ChatbotForm } from "../_components/chatbotForm"
import { IntegrationPanel } from "../_components/intigrationPanel"


export default function NewChatbotPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [createdBotId, setCreatedBotId] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)
 
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setFormData(data)

    try {
      const res = await fetch("/api/chatbots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (result.success) {
        setCreatedBotId(result.data.botId)
        setIsCreated(true)
        
      } else {
        alert(result.error || "Failed to create chatbot")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
                  {isCreated ? "Chatbot Created!" : "Create Your Chatbot"}
                </h1>
                <p className="text-xs text-text-muted hidden sm:block">
                  {isCreated 
                    ? "Your AI assistant is ready to use." 
                    : "Configure your AI assistant and preview responses in real time."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isCreated && (
                <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary bg-bg-glass border border-border-glass rounded-xl hover:bg-bg-glass-hover transition-all">
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
              )}
              {isCreated && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-success text-text-on-brand rounded-xl">
                  <Check className="w-4 h-4" />
                  Created
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form — hidden after creation */}
          {!isCreated && (
            <ChatbotForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Create Chatbot"
            />
          )}

          {/* Preview — always visible */}
          <ChatPreview
            botName={formData?.botName || "Customer Support Assistant"}
            avatarUrl={formData?.avatarUrl || ""}
            primaryColor={formData?.primaryColor || "#6366f1"}
            welcomeMsg={formData?.welcomeMsg || "Hello 👋\n\nHow can I help you today?"}
            questions={formData?.questions || ["How can I contact support?", "What are your pricing plans?", "How do I get started?"]}
            botId={createdBotId || undefined}
          />
        </div>
      </div>

      {/* Integration Panel — shown after creation */}
      {isCreated && createdBotId && formData && (
        <IntegrationPanel
          botId={createdBotId}
          primaryColor={formData.primaryColor}
          widgetPos={formData.widgetPos}
        />
      )}
    </div>
  )
}