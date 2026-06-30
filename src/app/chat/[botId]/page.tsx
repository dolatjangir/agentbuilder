"use client"

import { useState, useRef, useEffect, use } from "react"

interface ChatPageProps {
  params: Promise<{ botId: string }>
}

interface ChatbotConfig {
  id: string
  name: string
  welcomeMessage: string
  primaryColor: string
  avatar: string | null
  status: string
}

export default function ChatPage({ params }: ChatPageProps) {
  const { botId } = use(params)
  
  const [config, setConfig] = useState<ChatbotConfig | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch chatbot config from PUBLIC endpoint
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/chatbots/${botId}/public`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        
        const data = json.data
        setConfig({
          id: data.id,
          name: data.name,
          welcomeMessage: data.welcomeMessage,
          primaryColor: data.primaryColor,
          avatar: data.avatar,
          status: data.status,
        })
        setMessages([{ role: "bot", text: data.welcomeMessage || "Hi! How can I help you?" }])
      } catch {
        // Fallback
        setConfig({
          id: botId,
          name: "Chat Assistant",
          welcomeMessage: "Hi! How can I help you?",
          primaryColor: "#0066cc",
          avatar: null,
          status: "active",
        })
        setMessages([{ role: "bot", text: "Hi! How can I help you?" }])
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [botId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMessage }])
    setIsLoading(true)

    try {
      const res = await fetch(`/api/chat/${botId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      })
      const json = await res.json()
      
      // Handle your API response format: { success: true, data: { reply, sessionId } }
      const reply = json.data?.reply || json.data?.message?.content || "Thanks for your message!"
      const newSessionId = json.data?.sessionId
      
      if (newSessionId) setSessionId(newSessionId)
      
      setMessages(prev => [...prev, { role: "bot", text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, something went wrong." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const primaryColor = config?.primaryColor || "#0066cc"
  const botName = config?.name || "Chat Assistant"
  const avatar = config?.avatar || "🤖"

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div 
        className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg overflow-hidden">
          {config?.avatar ? (
            <img src={config.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>🤖</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">{botName}</h1>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[85%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}>
            <div 
              className="p-3 rounded-lg text-sm"
              style={msg.role === "user" 
                ? { backgroundColor: primaryColor, color: "white", borderTopRightRadius: "4px" }
                : { backgroundColor: "white", color: "#374151", border: "1px solid #e5e7eb", borderTopLeftRadius: "4px" }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-1 p-3">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 text-white text-sm rounded-lg disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}