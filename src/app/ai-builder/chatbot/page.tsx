"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence , Variants } from "framer-motion";
import {
  Bot,
  Save,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  Plus,
  X,
  ChevronDown,
  Zap,
  Scale,
  Brain,
  Palette,
  Upload,
  ArrowRight,
  MessageSquare,
  Loader2,
  Trash2,
  ExternalLink,
  Terminal,
  Globe,
  Link2,
  Cpu,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type Provider = "gemini" | "openai" | "claude" | "openrouter";

type ResponseStyle = "precise" | "balanced" | "creative";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const providers: { id: Provider; label: string; color: string; glow: string }[] = [
  { id: "gemini", label: "Gemini", color: "text-accent", glow: "shadow-[0_0_20px_-5px_var(--accent-glow)]" },
  { id: "openai", label: "OpenAI", color: "text-success", glow: "shadow-[0_0_20px_-5px_rgba(34,197,94,0.35)]" },
  { id: "claude", label: "Claude", color: "text-brand-secondary", glow: "shadow-[0_0_20px_-5px_var(--brand-secondary-glow)]" },
  { id: "openrouter", label: "OpenRouter", color: "text-warning", glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.35)]" },
];

const models: Record<Provider, { id: string; label: string; speed: "fast" | "balanced" | "powerful" }[]> = {
  gemini: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", speed: "fast" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", speed: "powerful" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", speed: "balanced" },
  ],
  openai: [
    { id: "gpt-5", label: "GPT-5", speed: "powerful" },
    { id: "gpt-4o", label: "GPT-4o", speed: "balanced" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini", speed: "fast" },
  ],
  claude: [
    { id: "claude-sonnet-4", label: "Claude Sonnet 4", speed: "powerful" },
    { id: "claude-haiku-3", label: "Claude Haiku 3", speed: "fast" },
    { id: "claude-opus-4", label: "Claude Opus 4", speed: "powerful" },
  ],
  openrouter: [
    { id: "deepseek-chat", label: "DeepSeek Chat", speed: "balanced" },
    { id: "llama-3-70b", label: "Llama 3 70B", speed: "fast" },
    { id: "qwen-2.5-72b", label: "Qwen 2.5 72B", speed: "balanced" },
  ],
};

const responseStyles: { id: ResponseStyle; label: string; temp: number; desc: string; icon: React.ReactNode }[] = [
  { id: "precise", label: "Precise", temp: 0.2, desc: "Factual, concise answers", icon: <Zap className="w-5 h-5" /> },
  { id: "balanced", label: "Balanced", temp: 0.7, desc: "Natural conversation flow", icon: <Scale className="w-5 h-5" /> },
  { id: "creative", label: "Creative", temp: 1.2, desc: "Imaginative, detailed responses", icon: <Brain className="w-5 h-5" /> },
];

const speedBadge = {
  fast: { icon: <Zap className="w-3 h-3" />, label: "Fast", color: "text-success bg-success/10 border-success/20" },
  balanced: { icon: <Scale className="w-3 h-3" />, label: "Balanced", color: "text-accent bg-accent/10 border-accent/20" },
  powerful: { icon: <Brain className="w-3 h-3" />, label: "Powerful", color: "text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20" },
};

const positions = [
  { id: "bottom-right", label: "Bottom Right" },
  { id: "bottom-left", label: "Bottom Left" },
];

const colorOptions = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6",
];

/* ------------------------------------------------------------------ */
/* Animation Variants                                                  */
/* ------------------------------------------------------------------ */
const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer:Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ------------------------------------------------------------------ */
/* Reusable Components                                                 */
/* ------------------------------------------------------------------ */
function GlassCard({ children, className = "", noHover = false }: { children: React.ReactNode; className?: string; noHover?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl overflow-hidden transition-all duration-300 ${noHover ? "" : "hover:bg-bg-glass-hover hover:border-border-glass"} ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon?: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      {icon && <span className="text-brand">{icon}</span>}
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-glass border border-border-glass text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover transition-all"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : label || "Copy"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function ChatbotBuilderPage() {
  /* -- State -- */
  const [botName, setBotName] = useState("Customer Support Assistant");
  const [botDesc, setBotDesc] = useState("Helping customers answer product and support questions.");
  const [provider, setProvider] = useState<Provider>("gemini");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("You are a professional customer support assistant.\n\nHelp users politely and accurately.\n\nNever provide misleading information.");
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>("balanced");
  const [welcomeMsg, setWelcomeMsg] = useState("Hello 👋\n\nHow can I help you today?");
  const [questions, setQuestions] = useState(["How can I contact support?", "What are your pricing plans?", "How do I get started?"]);
  const [newQuestion, setNewQuestion] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [widgetPos, setWidgetPos] = useState("bottom-right");
  const [widgetTitle, setWidgetTitle] = useState("Support Assistant");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Hello 👋\n\nHow can I help you today?" },
  ]);
  const [previewInput, setPreviewInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -- Effects -- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    setChatMessages([{ id: "1", role: "assistant", content: welcomeMsg }]);
  }, [welcomeMsg]);

  /* -- Handlers -- */
  const handleAddQuestion = () => {
    if (newQuestion.trim() && questions.length < 8) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleProviderChange = (p: Provider) => {
    setProvider(p);
    setModel(models[p][0].id);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsCreating(false);
    setIsCreated(true);
  };

  const handlePreviewSend = () => {
    if (!previewInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: previewInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setPreviewInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses: Record<ResponseStyle, string> = {
        precise: "Our Pro plan is $29/month with 50,000 messages. Enterprise starts at custom pricing. Would you like a detailed breakdown?",
        balanced: "We offer three plans: Free ($0), Pro ($29/mo), and Enterprise (custom). The Pro plan includes 50K messages, API access, and custom branding. Which one interests you?",
        creative: "Great question! 🚀 Our pricing is designed to scale with you. Start free, upgrade to Pro for $29 when you're ready to grow, or go Enterprise for unlimited power. Think of it as choosing your adventure — each path leads to AI greatness!",
      };
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[responseStyle],
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 1500);
  };

  const handleSuggestedClick = (q: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: q };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'd be happy to help with that! Let me pull up the most relevant information for you.",
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 1200);
  };

  const botId = "bot_" + Math.random().toString(36).substr(2, 9);
  const embedCode = `<script\n  src="https://yourdomain.com/widget.js?id=${botId}"\n  data-color="${primaryColor}"\n  data-position="${widgetPos}"\n></script>`;
  const apiEndpoint = `POST /api/chat/${botId}`;
  const publicUrl = `https://yourdomain.com/chat/${botId}`;

  const currentStyle = responseStyles.find((s) => s.id === responseStyle)!;
  const currentModel = models[provider].find((m) => m.id === model)!;

  /* -- Render -- */
  return (
    <main className="min-h-screen bg-bg-base text-text-primary antialiased selection:bg-brand-glow selection:text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_-5px_var(--brand-glow)]">
                <Bot className="w-5 h-5 text-text-on-brand" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">Create Your Chatbot</h1>
                <p className="text-xs text-text-muted hidden sm:block">Configure your AI assistant and preview responses in real time.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary bg-bg-glass border border-border-glass rounded-xl hover:bg-bg-glass-hover transition-all">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating || isCreated}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  isCreated
                    ? "bg-success text-text-on-brand"
                    : "bg-brand hover:bg-brand-hover text-text-on-brand shadow-[0_0_20px_-5px_var(--brand-glow)] hover:shadow-[0_0_30px_-5px_var(--brand-glow)] hover:-translate-y-0.5"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : isCreated ? (
                  <>
                    <Check className="w-4 h-4" />
                    Created
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Chatbot
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT PANEL - Configuration */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full lg:w-[40%] space-y-6"
          >
            {/* 1. Bot Details */}
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
                      placeholder="Customer Support Assistant"
                      className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                    <textarea
                      value={botDesc}
                      onChange={(e) => setBotDesc(e.target.value)}
                      placeholder="Helping customers answer product and support questions."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all resize-none"
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* 2. AI Provider */}
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${provider === p.id ? "bg-brand/20" : "bg-bg-elevated"}`}>
                        <span className={p.color}>
                          {p.id === "gemini" && <Sparkles className="w-5 h-5" />}
                          {p.id === "openai" && <Bot className="w-5 h-5" />}
                          {p.id === "claude" && <Brain className="w-5 h-5" />}
                          {p.id === "openrouter" && <Zap className="w-5 h-5" />}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${provider === p.id ? "text-text-primary" : "text-text-secondary"}`}>
                        {p.label}
                      </span>
                      {provider === p.id && (
                        <motion.div layoutId="providerCheck" className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                          <Check className="w-3 h-3 text-text-on-brand" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* 3. Model Selection */}
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
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
                {currentModel && (
                  <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${speedBadge[currentModel.speed].color}`}>
                    {speedBadge[currentModel.speed].icon}
                    {speedBadge[currentModel.speed].label}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* 4. API Key */}
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
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-3 text-xs text-text-muted flex items-center gap-1.5">
                  <ShieldIcon className="w-3 h-3" />
                  Your API key is encrypted and stored securely.
                </p>
              </GlassCard>
            </motion.div>

            {/* 5. System Prompt */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6">
                <SectionTitle icon={<MessageSquare className="w-4 h-4" />} title="Instructions" />
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a professional customer support assistant..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all resize-none min-h-[180px]"
                />
                <div className="mt-2 text-right text-xs text-text-muted">
                  {systemPrompt.length} characters
                </div>
              </GlassCard>
            </motion.div>

            {/* 6. Response Style */}
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
                        <motion.div layoutId="styleCheck" className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                          <Check className="w-3 h-3 text-text-on-brand" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* 7. Welcome Message */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6">
                <SectionTitle icon={<MessageSquare className="w-4 h-4" />} title="Welcome Message" />
                <textarea
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  placeholder="Hello 👋 How can I help you today?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all resize-none"
                />
              </GlassCard>
            </motion.div>

            {/* 8. Suggested Questions */}
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

            {/* 9. Appearance */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6">
                <SectionTitle icon={<Palette className="w-4 h-4" />} title="Widget Customization" />
                <div className="space-y-5">
                  {/* Avatar Upload */}
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
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-brand hover:text-brand-hover font-medium transition-colors"
                        >
                          Upload Image
                        </button>
                        <p className="text-xs text-text-muted mt-0.5">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Picker */}
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

                  {/* Widget Position */}
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

                  {/* Widget Title */}
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

            {/* Create Button (Mobile) */}
            <motion.div variants={fadeInUp} className="lg:hidden">
              <button
                onClick={handleCreate}
                disabled={isCreating || isCreated}
                className={`w-full py-4 rounded-xl text-base font-semibold transition-all ${
                  isCreated
                    ? "bg-success text-text-on-brand"
                    : "bg-gradient-to-r from-grad-start via-grad-mid to-grad-end text-text-on-brand shadow-[0_0_30px_-10px_var(--brand-glow)] hover:shadow-[0_0_40px_-10px_var(--brand-glow)] hover:-translate-y-0.5"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating your AI Assistant...
                  </span>
                ) : isCreated ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Chatbot Created
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Chatbot
                  </span>
                )}
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT PANEL - Live Preview */}
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
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
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
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap gap-2 pt-2"
                      >
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

              {/* Live Update Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted"
              >
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Live Preview — Updates in real time
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - Integration (shown after creation) */}
      <AnimatePresence>
        {isCreated && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
            className="border-t border-border-default bg-bg-elevated/30"
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
        )}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Small Shield Icon (inline)                                          */
/* ------------------------------------------------------------------ */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}