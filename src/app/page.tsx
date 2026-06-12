"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import {
  Bot,
  Code2,
  Zap,
  Shield,
  MessageSquare,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Settings,
  Globe,
  Users,
  BookOpen,
  ShoppingCart,
  Headphones,
  Layers,
  Cpu,
  Clock,
  Palette,
  History,
  Key,
  Rocket,
  Play,
  Star,
  Quote,
  Menu,
  Terminal,
  Lock,
  MousePointer,
  Truck,
  BarChart3,
  MessageCircle,
  ChevronRight,
  Mail,
  FileText,
  HelpCircle,
 
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/* Animation Variants                                                  */
/* ------------------------------------------------------------------ */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn : Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const staggerContainer : Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn : Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const features: Feature[] = [
  { icon: <Key className="w-5 h-5" />, title: "Bring Your Own API Key", description: "Connect your existing Gemini, OpenAI, Claude, or OpenRouter keys. No markup, no middleman." },
  { icon: <Cpu className="w-5 h-5" />, title: "Multiple LLM Providers", description: "Switch between providers instantly. Compare performance and pricing without rewriting code." },
  { icon: <Settings className="w-5 h-5" />, title: "Custom Instructions", description: "Define personality, tone, constraints, and knowledge boundaries for every bot." },
  { icon: <Globe className="w-5 h-5" />, title: "Website Widget", description: "Embed a floating chat bubble on any site with a single script tag. Works on React, Vue, plain HTML." },
  { icon: <Terminal className="w-5 h-5" />, title: "API Access", description: "Programmatically create, update, and query your chatbots via our REST API." },
  { icon: <Rocket className="w-5 h-5" />, title: "Fast Deployment", description: "Go from zero to live chatbot in under 5 minutes. No DevOps required." },
  { icon: <Palette className="w-5 h-5" />, title: "Theme Customization", description: "Match your brand with custom colors, logos, avatars, and chat bubble styles." },
  { icon: <History className="w-5 h-5" />, title: "Conversation History", description: "Review, search, and export every conversation. Analytics included out of the box." },
  { icon: <Lock className="w-5 h-5" />, title: "Secure API Handling", description: "Your keys are encrypted at rest. We never log or train on your conversation data." },
  { icon: <MousePointer className="w-5 h-5" />, title: "Responsive Chat Widget", description: "Optimized for mobile, tablet, and desktop. Auto-resizes and adapts to any viewport." },
];

const testimonials: Testimonial[] = [
  { quote: "We deployed a customer support bot in 10 minutes. It now handles 70% of our tier-1 tickets automatically.", name: "Sarah Chen", role: "Head of Support", company: "CloudShift" },
  { quote: "The ability to bring our own API keys saved us thousands in vendor markup. The widget looks native to our product.", name: "Marcus Johnson", role: "CTO", company: "FinLedger" },
  { quote: "I built an onboarding assistant for our SaaS without writing a single line of backend code. Game changer.", name: "Elena Rodriguez", role: "Product Lead", company: "TaskFlow" },
];

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Perfect for side projects and experiments.",
    features: ["1 Chatbot", "1,000 messages/mo", "OpenAI & Gemini", "Basic widget", "Community support"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ month",
    description: "For startups and growing businesses.",
    features: ["10 Chatbots", "50,000 messages/mo", "All LLM providers", "Custom branding", "API access", "Priority support"],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure and SLA.",
    features: ["Unlimited chatbots", "Unlimited messages", "SSO & SAML", "Audit logs", "Custom contracts", "Dedicated success manager"],
    cta: "Contact Sales",
  },
];

const faqs: FAQItem[] = [
  { question: "How does integration work?", answer: "After creating your bot, we generate a unique script tag. Paste it into your website's HTML before the closing </body> tag. The widget loads asynchronously and won't block your page." },
  { question: "Which LLMs are supported?", answer: "We support OpenAI (GPT-4o, GPT-4), Google Gemini, Anthropic Claude, OpenRouter, and any OpenAI-compatible API endpoint. More providers are added monthly." },
  { question: "Is my API key secure?", answer: "Absolutely. Your API keys are encrypted using AES-256 and stored in a hardware security module. We never use your keys for training, logging, or any purpose outside your explicit bot requests." },
  { question: "Can I customize the chatbot?", answer: "Yes. You can customize the name, avatar, color theme, welcome message, suggested prompts, and even inject custom CSS for advanced styling." },
  { question: "Do I need coding knowledge?", answer: "Not at all. The no-code dashboard lets you build and deploy bots visually. Developers can use our API and webhooks for advanced workflows." },
];

const useCases = [
  { icon: <Headphones className="w-6 h-6" />, title: "Customer Support", desc: "Instant answers, 24/7 availability, and seamless human handoff." },
  { icon: <Users className="w-6 h-6" />, title: "Lead Generation", desc: "Qualify visitors, capture emails, and book meetings while you sleep." },
  { icon: <BookOpen className="w-6 h-6" />, title: "Documentation Assistant", desc: "Help users find answers in your docs without leaving the page." },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "E-Commerce Assistant", desc: "Recommend products, track orders, and handle returns automatically." },
  { icon: <Layers className="w-6 h-6" />, title: "Internal Team Assistant", desc: "Onboard employees, answer HR questions, and search internal wikis." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "SaaS Onboarding Bot", desc: "Guide new users to activation with contextual tips and checklists." },
];

/* ------------------------------------------------------------------ */
/* Reusable Components                                                 */
/* ------------------------------------------------------------------ */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-text-primary via-text-secondary to-text-muted bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && <p className="text-text-muted text-lg md:text-xl leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl p-6 md:p-8 transition-all duration-300 ${
        hover ? "hover:bg-bg-glass-hover hover:border-border-glass hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#solution" },
    { label: "Pricing", href: "#pricing" },
    { label: "Documentation", href: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg-base/80 backdrop-blur-xl border-b border-border-default" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_-5px_var(--brand-glow)] group-hover:shadow-[0_0_30px_-5px_var(--brand-glow)] transition-shadow">
              <Bot className="w-5 h-5 text-text-on-brand" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">ChatBuild</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-glass transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Sign In
            </a>
            <a
              href="#pricing"
              className="px-5 py-2.5 text-sm font-semibold text-text-on-brand bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-[0_0_20px_-5px_var(--brand-glow)] hover:shadow-[0_0_30px_-5px_var(--brand-glow)] hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-text-secondary hover:text-text-primary">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-elevated/95 backdrop-blur-xl border-b border-border-default overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-glass rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border-default flex flex-col gap-2">
                <a href="#" className="block px-4 py-3 text-center text-text-secondary hover:text-text-primary">Sign In</a>
                <a href="#pricing" className="block px-4 py-3 text-center text-text-on-brand bg-brand rounded-xl font-semibold">Get Started</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[var(--grad-radial)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-grad-start/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-grad-end/10 rounded-full blur-[128px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-glass border border-border-glass mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-text-secondary">AI Chatbot Builder for Modern Teams</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Build and Deploy{" "}
              <span className="bg-gradient-to-r from-grad-start via-grad-mid to-grad-end bg-clip-text text-transparent">
                AI Chatbots
              </span>{" "}
              in Minutes
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-muted leading-relaxed mb-10 max-w-xl">
              Create powerful AI assistants using your own LLM provider and embed them anywhere with a single line of code.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-text-on-brand bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-[0_0_30px_-5px_var(--brand-glow)] hover:shadow-[0_0_40px_-5px_var(--brand-glow)] hover:-translate-y-0.5"
              >
                <Rocket className="w-5 h-5" />
                Build Your Chatbot
              </a>
              <a
                href="#embed"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-text-primary bg-bg-glass hover:bg-bg-glass-hover border border-border-glass rounded-xl transition-all hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                View Demo
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6 text-sm text-text-muted">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-base bg-bg-elevated flex items-center justify-center text-xs font-medium text-text-secondary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 2,000+ developers</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Chat Widget Mockup */}
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-grad-start to-grad-end rounded-3xl blur opacity-20" />
              <GlassCard hover={false} className="relative shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">AI Assistant</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-text-muted">Online</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-end">
                    <div className="bg-brand text-text-on-brand rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%]">
                      How do I reset my password?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-bg-elevated border border-border-default text-text-secondary rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[90%]">
                      I can help with that. Go to Settings → Security → Change Password. Would you like me to send a reset link to your email?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-brand text-text-on-brand rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%]">
                      Yes, please send it.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-bg-elevated border border-border-default text-text-secondary rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[90%]">
                      Done! Check your inbox for the reset link. It expires in 15 minutes.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated rounded-xl border border-border-default">
                  <MessageSquare className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">Type a message...</span>
                </div>
              </GlassCard>

              {/* Floating code snippet */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 md:-left-12"
              >
                <div className="bg-bg-code border border-border-code rounded-xl p-4 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
                  </div>
                  <code className="text-xs text-text-code font-mono">
                    &lt;script src=&quot;widget.js?id=bot123&quot;&gt;&lt;/script&gt;
                  </code>
                </div>
              </motion.div>

              {/* Floating provider badges */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 -right-4 md:-right-8 flex gap-2"
              >
                <div className="bg-bg-glass border border-border-glass rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-xl">
                  GPT-4
                </div>
                <div className="bg-bg-glass border border-border-glass rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-xl">
                  Claude
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    { icon: <Settings className="w-6 h-6 text-error" />, title: "Complex Setup", desc: "Dozens of config files, dependency hell, and weeks of boilerplate." },
    { icon: <Terminal className="w-6 h-6 text-error" />, title: "Backend Required", desc: "Managing servers, scaling, and security drains engineering resources." },
    { icon: <Zap className="w-6 h-6 text-error" />, title: "Confusing APIs", desc: "Every provider has different formats, auth schemes, and rate limits." },
    { icon: <Clock className="w-6 h-6 text-error" />, title: "Slow Deployment", desc: "From idea to production often takes months, not minutes." },
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Building AI Chatbots Shouldn't Be Complicated"
          subtitle="Developers waste weeks on infrastructure instead of focusing on what matters — the conversation experience."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {problems.map((p, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <GlassCard className="h-full">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{p.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const steps = [
    { num: "01", title: "Choose Provider", desc: "Connect Gemini, OpenAI, Claude, or OpenRouter in one click.", providers: ["Gemini", "OpenAI", "Claude", "OpenRouter"] },
    { num: "02", title: "Customize Bot", desc: "Set the name, instructions, model, and behavior to match your brand." },
    { num: "03", title: "Deploy Anywhere", desc: "Copy and paste a single script tag. Your bot is live instantly." },
  ];

  return (
    <section id="solution" className="py-24 md:py-32 relative bg-bg-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Create, Customize, Deploy"
          subtitle="Three simple steps to launch your AI assistant. No backend, no DevOps, no drama."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 md:gap-12"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-bg-base border border-border-glass flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_var(--brand-glow)]">
                    <span className="text-2xl font-bold bg-gradient-to-br from-grad-start to-grad-end bg-clip-text text-transparent">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-muted leading-relaxed mb-6">{step.desc}</p>

                  {step.providers && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {step.providers.map((provider) => (
                        <span key={provider} className="px-3 py-1 rounded-lg bg-bg-glass border border-border-glass text-xs font-medium text-text-secondary">
                          {provider}
                        </span>
                      ))}
                    </div>
                  )}

                  {i === 1 && (
                    <div className="mt-6 w-full max-w-xs mx-auto bg-bg-code border border-border-code rounded-xl p-4 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-xs text-text-muted font-mono">config.json</span>
                      </div>
                      <code className="text-xs text-text-code font-mono block space-y-1">
                        <div>{`{`}</div>
                        <div className="pl-3">{`"name": "SupportBot",`}</div>
                        <div className="pl-3">{`"model": "gpt-4o",`}</div>
                        <div className="pl-3">{`"tone": "friendly"`}</div>
                        <div>{`}`}</div>
                      </code>
                    </div>
                  )}

                  {i === 2 && (
                    <div className="mt-6 w-full max-w-xs mx-auto bg-bg-code border border-border-code rounded-xl p-4 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Code2 className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-xs text-text-muted font-mono">embed.html</span>
                      </div>
                      <code className="text-xs text-text-code font-mono break-all">
                        &lt;script src=&quot;https://cdn.chatbuild.ai/widget.js?id=abc123&quot;&gt;&lt;/script&gt;
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Everything You Need"
          subtitle="A complete toolkit for building, deploying, and managing AI chatbots at scale."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={scaleIn}>
              <GlassCard className="h-full group">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4 text-brand group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function EmbedSection() {
  return (
    <section id="embed" className="py-24 md:py-32 relative bg-bg-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="One Line Integration"
          subtitle="Paste once. Your chatbot is live on every page. Zero maintenance, zero dependencies."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          <motion.div variants={fadeInUp}>
            <div className="bg-bg-code border border-border-code rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border-code bg-bg-elevated/50">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
                <span className="ml-3 text-xs text-text-muted font-mono">index.html</span>
              </div>
              <div className="p-6 md:p-8 overflow-x-auto">
                <pre className="text-sm md:text-base font-mono leading-relaxed">
                  <code>
                    <span className="text-text-muted">&lt;!-- Paste this before &lt;/body&gt; --&gt;</span>
                    {"\n"}
                    <span className="text-brand-secondary">&lt;script</span>
                    {"\n  "}
                    <span className="text-accent">src</span>
                    <span className="text-text-primary">=</span>
                    <span className="text-success">&quot;https://cdn.chatbuild.ai/widget.js&quot;</span>
                    {"\n  "}
                    <span className="text-accent">data-id</span>
                    <span className="text-text-primary">=</span>
                    <span className="text-success">&quot;bot_abc123&quot;</span>
                    {"\n"}
                    <span className="text-brand-secondary">&gt;&lt;/script&gt;</span>
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <div className="bg-bg-base border border-border-default rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default bg-bg-elevated">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-border-glass" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-glass" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border-glass" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-bg-base rounded-md px-3 py-1 text-xs text-text-muted text-center border border-border-default">
                    your-website.com
                  </div>
                </div>
              </div>

              {/* Mock page content */}
              <div className="p-8 md:p-12 space-y-6 relative min-h-[320px]">
                <div className="h-4 w-3/4 bg-bg-elevated rounded" />
                <div className="h-4 w-1/2 bg-bg-elevated rounded" />
                <div className="h-32 w-full bg-bg-elevated rounded-xl" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-bg-elevated rounded-lg" />
                  <div className="h-20 bg-bg-elevated rounded-lg" />
                  <div className="h-20 bg-bg-elevated rounded-lg" />
                </div>

                {/* Floating widget */}
                <div className="absolute bottom-6 right-6 w-72">
                  <div className="bg-bg-elevated border border-border-glass rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default bg-bg-glass">
                      <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <span className="text-sm font-medium text-text-primary">Support</span>
                      <div className="ml-auto w-2 h-2 rounded-full bg-success" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-bg-base rounded-lg rounded-tl-sm px-3 py-2 text-xs text-text-secondary border border-border-default">
                        Hi! How can I help you today?
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-brand text-text-on-brand rounded-lg rounded-tr-sm px-3 py-2 text-xs">
                          I need pricing info
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const items = [
    { label: "Simple Setup", us: true, them: false },
    { label: "No Backend Required", us: true, them: false },
    { label: "Own API Keys", us: true, them: false },
    { label: "Fast Deployment", us: true, them: false },
    { label: "Developer Friendly", us: true, them: false },
    { label: "Vendor Lock-In", us: false, them: true },
    { label: "Hidden Costs", us: false, them: true },
    { label: "Slow Deployment", us: false, them: true },
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Why Choose Us"
          subtitle="See how we compare to traditional chatbot platforms."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-4 px-6 pb-4 text-sm font-semibold text-text-muted uppercase tracking-wider">
            <div>Feature</div>
            <div className="text-center text-brand">ChatBuild</div>
            <div className="text-center text-text-muted">Others</div>
          </div>

          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl border border-border-card bg-bg-card hover:bg-bg-glass-hover transition-colors"
            >
              <span className="text-text-secondary font-medium">{item.label}</span>
              <div className="flex justify-center">
                {item.us ? (
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
                    <X className="w-4 h-4 text-error" />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {item.them ? (
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
                    <X className="w-4 h-4 text-error" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="py-24 md:py-32 relative bg-bg-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Built for Every Use Case"
          subtitle="From customer support to internal tooling, deploy AI where it matters most."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {useCases.map((uc, i) => (
            <motion.div key={i} variants={scaleIn}>
              <GlassCard className="h-full group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-grad-start/20 to-grad-end/20 flex items-center justify-center mb-5 text-brand group-hover:scale-110 transition-transform duration-300">
                  {uc.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{uc.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{uc.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Loved by Developers"
          subtitle="Join thousands of teams shipping AI chatbots faster."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <GlassCard className="h-full relative">
                <Quote className="w-10 h-10 text-brand/20 mb-4" />
                <p className="text-text-secondary leading-relaxed mb-8 text-lg">{t.quote}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-grad-start to-grad-end flex items-center justify-center text-text-on-brand font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{t.name}</div>
                    <div className="text-sm text-text-muted">
                      {t.role} at {t.company}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative bg-bg-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Simple, Transparent Pricing"
          subtitle="Start free, scale as you grow. No hidden fees, no surprises."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier, i) => (
            <motion.div key={i} variants={scaleIn} className="relative">
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-brand text-text-on-brand text-xs font-bold shadow-[0_0_20px_-5px_var(--brand-glow)]">
                    Most Popular
                  </span>
                </div>
              )}
              <GlassCard
                hover={true}
                className={`h-full flex flex-col ${tier.popular ? "border-border-popular bg-bg-popular shadow-[0_0_40px_-15px_var(--brand-glow)]" : ""}`}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">{tier.price}</span>
                    <span className="text-text-muted">{tier.period}</span>
                  </div>
                  <p className="text-sm text-text-muted mt-2">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 ${
                    tier.popular
                      ? "bg-brand text-text-on-brand shadow-[0_0_20px_-5px_var(--brand-glow)] hover:shadow-[0_0_30px_-5px_var(--brand-glow)]"
                      : "bg-bg-glass text-text-primary border border-border-glass hover:bg-bg-glass-hover"
                  }`}
                >
                  {tier.cta}
                </a>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about building with ChatBuild."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="border border-border-card rounded-2xl bg-bg-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-glass-hover transition-colors"
                >
                  <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 text-text-muted leading-relaxed border-t border-border-default pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--grad-radial)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-grad-start/10 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Launch Your AI Chatbot{" "}
            <span className="bg-gradient-to-r from-grad-start via-grad-mid to-grad-end bg-clip-text text-transparent">
              Today
            </span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            From idea to deployment in minutes. No credit card required to start.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-builder"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-text-on-brand bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-[0_0_40px_-5px_var(--brand-glow)] hover:shadow-[0_0_50px_-5px_var(--brand-glow)] hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              Start Building Free
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-text-primary bg-bg-glass hover:bg-bg-glass-hover border border-border-glass rounded-xl transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to Sales
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Documentation", "Changelog"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Community", "Help Center", "API Status", "Security"],
    Legal: ["Privacy", "Terms", "Cookie Policy", "GDPR"],
  };

  return (
    <footer className="border-t border-border-default bg-bg-elevated/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
                <Bot className="w-5 h-5 text-text-on-brand" />
              </div>
              <span className="text-xl font-bold text-text-primary">ChatBuild</span>
            </a>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs mb-6">
              The fastest way to build and deploy AI chatbots using your own API keys. No backend required.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-bg-glass border border-border-glass flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-glass-hover transition-colors">
                {/* <Github className="w-4 h-4" /> */}
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-bg-glass border border-border-glass flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-glass-hover transition-colors">
                {/* <Twitter className="w-4 h-4" /> */}
              </a>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-text-primary mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border-default flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">© 2026 ChatBuild. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <main className="min-h-screen bg-bg-base text-text-primary antialiased selection:bg-brand-glow selection:text-text-primary">
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-grad-start via-grad-mid to-grad-end origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <EmbedSection />
      <ComparisonSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}