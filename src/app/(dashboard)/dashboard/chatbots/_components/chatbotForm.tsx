"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence,Variants } from "framer-motion"
import {
  Bot, Sparkles, Cpu, Terminal, MessageSquare, Scale,
  Plus, X, ChevronDown, Palette, Upload, Check, Zap, Brain,
} from "lucide-react"

// Types
type Provider = "gemini" | "openai" | "claude" | "openrouter"
type ResponseStyle = "precise" | "balanced" | "creative"

interface ChatbotFormProps {
  initialData?: {
    botName: string
    botDesc: string
    provider: Provider
    model: string
    systemPrompt: string
    responseStyle: ResponseStyle
    welcomeMsg: string
    questions: string[]
    primaryColor: string
    widgetPos: string
    widgetTitle: string
    avatarUrl: string
  }
  onSubmit: (data: any) => void
  isSubmitting: boolean
  submitLabel: string
}

const providers = [
  { id: "gemini" as Provider, label: "Gemini", color: "text-accent", glow: "shadow-[0_0_20px_-5px_var(--accent-glow)]" },
  { id: "openai" as Provider, label: "OpenAI", color: "text-success", glow: "shadow-[0_0_20px_-5px_rgba(34,197,94,0.35)]" },
  { id: "claude" as Provider, label: "Claude", color: "text-brand-secondary", glow: "shadow-[0_0_20px_-5px_var(--brand-secondary-glow)]" },
  { id: "openrouter" as Provider, label: "OpenRouter", color: "text-warning", glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.35)]" },
]

const models: Record<Provider, { id: string; label: string }[]> = {
  gemini: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  ],
  openai: [
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini" },
  ],
  claude: [
    { id: "claude-sonnet-4", label: "Claude Sonnet 4" },
    { id: "claude-haiku-3", label: "Claude Haiku 3" },
  ],
  openrouter: [
    { id: "deepseek-chat", label: "DeepSeek Chat" },
    { id: "llama-3-70b", label: "Llama 3 70B" },
  ],
}

const responseStyles = [
  { id: "precise" as ResponseStyle, label: "Precise", temp: 0.2, desc: "Factual, concise answers", icon: <Zap className="w-5 h-5" /> },
  { id: "balanced" as ResponseStyle, label: "Balanced", temp: 0.7, desc: "Natural conversation flow", icon: <Scale className="w-5 h-5" /> },
  { id: "creative" as ResponseStyle, label: "Creative", temp: 1.2, desc: "Imaginative, detailed responses", icon: <Brain className="w-5 h-5" /> },
]

const positions = [
  { id: "bottom-right", label: "Bottom Right" },
  { id: "bottom-left", label: "Bottom Left" },
]

const colorOptions = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6",
]

const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function GlassCard({ children, className = "", noHover = false }: { children: React.ReactNode; className?: string; noHover?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl overflow-hidden transition-all duration-300 ${noHover ? "" : "hover:bg-bg-glass-hover hover:border-border-glass"} ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, title }: { icon?: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      {icon && <span className="text-brand">{icon}</span>}
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">{title}</h3>
    </div>
  )
}

export function ChatbotForm({ initialData, onSubmit, isSubmitting, submitLabel }: ChatbotFormProps) {
  const [botName, setBotName] = useState(initialData?.botName || "Customer Support Assistant")
  const [botDesc, setBotDesc] = useState(initialData?.botDesc || "Helping customers answer product and support questions.")
  const [provider, setProvider] = useState<Provider>(initialData?.provider || "gemini")
  const [model, setModel] = useState(initialData?.model || "gemini-2.5-flash")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(initialData?.systemPrompt || "You are a professional customer support assistant.\n\nHelp users politely and accurately.\n\nNever provide misleading information.")
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>(initialData?.responseStyle || "balanced")
  const [welcomeMsg, setWelcomeMsg] = useState(initialData?.welcomeMsg || "Hello 👋\n\nHow can I help you today?")
  const [questions, setQuestions] = useState<string[]>(initialData?.questions || ["How can I contact support?", "What are your pricing plans?", "How do I get started?"])
  const [newQuestion, setNewQuestion] = useState("")
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#6366f1")
  const [widgetPos, setWidgetPos] = useState(initialData?.widgetPos || "bottom-right")
  const [widgetTitle, setWidgetTitle] = useState(initialData?.widgetTitle || "Support Assistant")
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProviderChange = (p: Provider) => {
    setProvider(p)
    setModel(models[p][0].id)
  }

const handleAvatarUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64 = reader.result;

    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64,
      }),
    });

    const data = await response.json();

    console.log(data.url);

    // Save Cloudinary URL in state
    setAvatarUrl(data.url);
  };

  reader.readAsDataURL(file);
};

  const handleAddQuestion = () => {
    if (newQuestion.trim() && questions.length < 8) {
      setQuestions([...questions, newQuestion.trim()])
      setNewQuestion("")
    }
  }

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    onSubmit({
      botName,
      botDesc,
      provider,
      model,
      apiKey,
      systemPrompt,
      responseStyle,
      welcomeMsg,
      questions,
      primaryColor,
      widgetPos,
      widgetTitle,
      avatarUrl,
    })
  }

  const currentStyle = responseStyles.find((s) => s.id === responseStyle)!

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full lg:w-[40%] space-y-6"
    >
      {/* Bot Details */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Bot className="w-4 h-4" />} title="Bot Information" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Bot Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
              <textarea
                value={botDesc}
                onChange={(e) => setBotDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all resize-none"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Provider */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Sparkles className="w-4 h-4" />} title="Choose Provider" />
          <div className="grid grid-cols-2 gap-3">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                  provider === p.id
                    ? `border-brand bg-brand/10 ${p.glow}`
                    : "border-border-card bg-bg-glass hover:bg-bg-glass-hover"
                }`}
              >
                <span className={`text-sm font-medium ${provider === p.id ? "text-text-primary" : "text-text-secondary"}`}>
                  {p.label}
                </span>
                {provider === p.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                    <Check className="w-3 h-3 text-text-on-brand" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Model */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Cpu className="w-4 h-4" />} title="Choose Model" />
          <div className="relative">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl bg-bg-input border border-border-input text-text-primary text-sm appearance-none focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all cursor-pointer"
            >
              {models[provider].map((m) => (
                <option key={m.id} value={m.id} className="bg-black/70">
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </GlassCard>
      </motion.div>

      {/* API Key */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Terminal className="w-4 h-4" />} title="API Credentials" />
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-4 py-3 pr-12 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* System Prompt */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<MessageSquare className="w-4 h-4" />} title="Instructions" />
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all resize-none min-h-[180px]"
          />
          <div className="mt-2 text-right text-xs text-text-muted">
            {systemPrompt.length} characters
          </div>
        </GlassCard>
      </motion.div>

      {/* Response Style */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Scale className="w-4 h-4" />} title="Response Style" />
          <div className="grid grid-cols-3 gap-3">
            {responseStyles.map((s) => (
              <button
                key={s.id}
                onClick={() => setResponseStyle(s.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                  responseStyle === s.id
                    ? "border-brand bg-brand/10 shadow-[0_0_20px_-5px_var(--brand-glow)]"
                    : "border-border-card bg-bg-glass hover:bg-bg-glass-hover"
                }`}
              >
                <span className={responseStyle === s.id ? "text-brand" : "text-text-muted"}>
                  {s.icon}
                </span>
                <span className={`text-sm font-semibold ${responseStyle === s.id ? "text-text-primary" : "text-text-secondary"}`}>
                  {s.label}
                </span>
                <span className="text-xs text-text-muted">Temp: {s.temp}</span>
                {responseStyle === s.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                    <Check className="w-3 h-3 text-text-on-brand" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Welcome Message */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<MessageSquare className="w-4 h-4" />} title="Welcome Message" />
          <textarea
            value={welcomeMsg}
            onChange={(e) => setWelcomeMsg(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all resize-none"
          />
        </GlassCard>
      </motion.div>

      {/* Questions */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Plus className="w-4 h-4" />} title="Starter Questions" />
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
              placeholder="Add a suggested question..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
            />
            <button
              onClick={handleAddQuestion}
              disabled={!newQuestion.trim() || questions.length >= 8}
              className="px-4 py-2.5 rounded-xl bg-brand text-text-on-brand text-sm font-medium hover:bg-brand-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {questions.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-glass border border-border-glass text-sm text-text-secondary hover:text-text-primary hover:border-brand/30 transition-all"
                >
                  <span>{q}</span>
                  <button
                    onClick={() => handleRemoveQuestion(i)}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={fadeInUp}>
        <GlassCard className="p-6">
          <SectionTitle icon={<Palette className="w-4 h-4" />} title="Widget Customization" />
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Bot Avatar</label>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl border-2 border-dashed border-border-glass flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5 text-text-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="text-sm text-brand hover:text-brand-hover font-medium transition-colors">
                    Upload Image
                  </button>
                  <p className="text-xs text-text-muted mt-0.5">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Primary Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setPrimaryColor(c)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      primaryColor === c ? "ring-2 ring-text-primary ring-offset-2 ring-offset-bg-base scale-110" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Widget Position</label>
              <div className="grid grid-cols-2 gap-3">
                {positions.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setWidgetPos(pos.id)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      widgetPos === pos.id
                        ? "border-brand bg-brand/10 text-text-primary"
                        : "border-border-card bg-bg-glass text-text-secondary hover:bg-bg-glass-hover"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Widget Title</label>
              <input
                type="text"
                value={widgetTitle}
                onChange={(e) => setWidgetTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={fadeInUp} className="lg:hidden">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl text-base font-semibold bg-brand text-text-on-brand shadow-[0_0_30px_-10px_var(--brand-glow)] disabled:opacity-70"
        >
          {isSubmitting ? "Creating..." : submitLabel}
        </button>
      </motion.div>

      {/* Desktop Submit */}
      <motion.div variants={fadeInUp} className="hidden lg:block">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl text-base font-semibold bg-brand text-text-on-brand shadow-[0_0_30px_-10px_var(--brand-glow)] hover:shadow-[0_0_40px_-10px_var(--brand-glow)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : submitLabel}
        </button>
      </motion.div>
    </motion.div>
  )
}