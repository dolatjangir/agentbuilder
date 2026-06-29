"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Send, Loader2 } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatPreviewProps {
  botName: string
  avatarUrl: string
  primaryColor: string
  welcomeMsg: string
  questions: string[]
  botId?: string
}

function GlassCard({ children, className = "", noHover = false }: { children: React.ReactNode; className?: string; noHover?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl overflow-hidden transition-all duration-300 ${noHover ? "" : "hover:bg-bg-glass-hover hover:border-border-glass"} ${className}`}>
      {children}
    </div>
  )
}

export function ChatPreview({ botName, avatarUrl, primaryColor, welcomeMsg, questions, botId }: ChatPreviewProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: welcomeMsg },
  ])
  const [previewInput, setPreviewInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  useEffect(() => {
    setChatMessages([{ id: "1", role: "assistant", content: welcomeMsg }])
  }, [welcomeMsg])

  const handlePreviewSend = async () => {
    if (!previewInput.trim()) return
    if (!botId) {
      // Demo mode — no backend
      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: previewInput }
      setChatMessages(prev => [...prev, userMsg])
      setPreviewInput("")
      setIsTyping(true)
      
      setTimeout(() => {
        setIsTyping(false)
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'd be happy to help with that! This is a preview — create the chatbot to get real AI responses.",
        }
        setChatMessages(prev => [...prev, assistantMsg])
      }, 1200)
      return
    }

    // Real backend mode
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: previewInput }
    setChatMessages(prev => [...prev, userMsg])
    setPreviewInput("")
    setIsTyping(true)

    try {
      const res = await fetch(`/api/chat/${botId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: previewInput, sessionId }),
      })

      const data = await res.json()
      setIsTyping(false)

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: data.data.message.id,
          role: "assistant",
          content: data.data.message.content,
        }
        setChatMessages(prev => [...prev, assistantMsg])
        setSessionId(data.data.sessionId)
      } else {
        const errorMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ ${data.error || "Service unavailable"}`,
        }
        setChatMessages(prev => [...prev, errorMsg])
      }
    } catch {
      setIsTyping(false)
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "⚠️ Failed to send message. Please try again.",
      }
      setChatMessages(prev => [...prev, errorMsg])
    }
  }

  const handleSuggestedClick = (q: string) => {
    setPreviewInput(q)
    // Auto-send after a brief delay
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as any
      handlePreviewSend()
    }, 100)
  }

  return (
    <div className="w-full lg:w-[60%]">
      <div className="lg:sticky lg:top-24">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard noHover className="overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-border-default flex items-center gap-3" style={{ backgroundColor: `${primaryColor}10` }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Bot" className="w-full h-full object-cover" />
                ) : (
                  <Bot className="w-5 h-5" style={{ color: primaryColor }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary truncate">{botName}</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-text-muted">Online</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[420px] md:h-[500px] overflow-y-auto p-5 space-y-4 bg-bg-base/50">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "text-text-on-brand rounded-tr-sm"
                        : "bg-bg-elevated border border-border-default text-text-secondary rounded-tl-sm"
                    }`}
                    style={msg.role === "user" ? { backgroundColor: primaryColor } : {}}
                  >
                    {msg.content.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-bg-elevated border border-border-default rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-text-muted"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested Questions */}
              {questions.length > 0 && !isTyping && chatMessages.length === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 pt-2">
                  {questions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedClick(q)}
                      className="px-3 py-1.5 rounded-lg bg-bg-glass border border-border-glass text-xs text-text-secondary hover:text-text-primary hover:border-brand/30 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border-default bg-bg-elevated/50">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={previewInput}
                  onChange={(e) => setPreviewInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePreviewSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                />
                <button
                  onClick={handlePreviewSend}
                  disabled={!previewInput.trim() || isTyping}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-5 h-5 text-text-on-brand" />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted"
        >
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          {botId ? "Live Preview — Connected to AI" : "Live Preview — Demo Mode (create bot to connect)"}
        </motion.div>
      </div>
    </div>
  )
}