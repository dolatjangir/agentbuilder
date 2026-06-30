"use client"

import { motion , Variants } from "framer-motion"
import { Terminal, Link2, Globe, ExternalLink, Check } from "lucide-react"
import { useEffect, useState } from "react"

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-bg-glass-hover hover:border-border-glass ${className}`}>
      {children}
    </div>
  )
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-glass border border-border-glass text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover transition-all"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Link2 className="w-3.5 h-3.5" />}
      {copied ? "Copied" : label || "Copy"}
    </button>
  )
}

const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
interface Chatbot {
  botId: string
  botName: string
  primaryColor: string
  widgetPos: string
  status: string
  welcomeMsg: string
  avatarUrl: string | null
}

interface IntegrationPanelProps {
  botId: string
  primaryColor: string
  widgetPos: string
}

export function IntegrationPanel({ botId, primaryColor, widgetPos }: IntegrationPanelProps) {
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000")
  const [bot, setBot] = useState<Chatbot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
   useEffect(() => {
    // On client side, use current window location
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`)
    }
  }, [])

   useEffect(() => {
    async function fetchBot() {
      try {
        const res = await fetch(`/api/chatbots/${botId}`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        setBot(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    fetchBot()
  }, [botId])

if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !bot) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error || "Chatbot not found"}</p>
      </div>
    )
  }

 const embedCode = `<script
  src="${baseUrl}/widget.js?id=${botId}"
  data-color="${primaryColor}"
  data-position="${widgetPos}"
></script>`
  const apiEndpoint = `POST ${baseUrl}/api/chat/${botId}`
   const publicUrl = `${baseUrl}/chat/${botId}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t border-border-default bg-bg-elevated/30 mt-8"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4">
              <Check className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Chatbot Ready</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Your Chatbot is Live</h2>
            <p className="text-text-muted">Choose how you want to integrate it.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Embed Code */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-4 h-4 text-brand" />
                  <h3 className="text-sm font-semibold text-text-primary">Embed Code</h3>
                </div>
                <div className="bg-bg-code border border-border-code rounded-xl p-4 mb-4 overflow-x-auto">
                  <pre className="text-xs text-text-code font-mono whitespace-pre-wrap break-all">
                    {embedCode}
                  </pre>
                </div>
                <CopyButton text={embedCode} label="Copy Script" />
              </GlassCard>
            </motion.div>

            {/* API Endpoint */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold text-text-primary">API Endpoint</h3>
                </div>
                <div className="bg-bg-code border border-border-code rounded-xl p-4 mb-4">
                  <code className="text-xs text-text-code font-mono">{apiEndpoint}</code>
                </div>
                <CopyButton text={apiEndpoint} label="Copy Endpoint" />
              </GlassCard>
            </motion.div>

            {/* Public URL */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-success" />
                  <h3 className="text-sm font-semibold text-text-primary">Public URL</h3>
                </div>
                <div className="bg-bg-code border border-border-code rounded-xl p-4 mb-4 overflow-x-auto">
                  <code className="text-xs text-text-code font-mono break-all">{publicUrl}</code>
                </div>
                <div className="flex gap-2">
                  <CopyButton text={publicUrl} label="Copy URL" />
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-glass border border-border-glass text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}