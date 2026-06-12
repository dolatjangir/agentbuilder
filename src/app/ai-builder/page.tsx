"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Bot,
  BookOpen,
  Cpu,
  Workflow,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Check,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface BuilderOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  href: string;
  iconColor: string;
  glowColor: string;
  glowShadow: string;
}

/* ------------------------------------------------------------------ */
/* Animation Variants                                                  */
/* ------------------------------------------------------------------ */
const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer:Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn:Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const builderOptions: BuilderOption[] = [
  {
    id: "chatbot",
    icon: <Bot className="w-8 h-8" />,
    title: "Chatbot",
    description: "Create AI-powered chat assistants using Gemini, OpenAI, Claude, or OpenRouter. Perfect for websites, customer support, and personal assistants.",
    features: ["Custom Instructions", "Multiple Models", "Easy Website Integration"],
    buttonText: "Build Chatbot",
    href: "/ai-builder/chatbot",
    iconColor: "text-brand",
    glowColor: "bg-brand/15",
    glowShadow: "shadow-[0_0_30px_-10px_var(--brand-glow)]",
  },
  {
    id: "knowledge-base",
    icon: <BookOpen className="w-8 h-8" />,
    title: "Knowledge Base Bot",
    description: "Train AI on your PDFs, documents, FAQs, and website content. Deliver accurate answers from your own knowledge.",
    features: ["PDF Upload", "Vector Search", "Context-Aware Responses"],
    buttonText: "Build Knowledge Bot",
    href: "/builder/knowledge-base",
    iconColor: "text-brand-secondary",
    glowColor: "bg-brand-secondary/15",
    glowShadow: "shadow-[0_0_30px_-10px_var(--brand-secondary-glow)]",
  },
  {
    id: "agent",
    icon: <Cpu className="w-8 h-8" />,
    title: "AI Agent",
    description: "Build intelligent agents capable of reasoning, decision-making, and using tools to complete tasks autonomously.",
    features: ["Tool Usage", "Memory", "Task Automation"],
    buttonText: "Build AI Agent",
    href: "/builder/agent",
    iconColor: "text-success",
    glowColor: "bg-success/15",
    glowShadow: "shadow-[0_0_30px_-10px_rgba(34,197,94,0.35)]",
  },
  {
    id: "multi-agent",
    icon: <Workflow className="w-8 h-8" />,
    title: "Multi-Agent Workflow",
    description: "Create teams of AI agents that collaborate together to solve complex business workflows.",
    features: ["Agent Collaboration", "Workflow Automation", "Advanced Orchestration"],
    buttonText: "Build Workflow",
    href: "/builder/multi-agent",
    iconColor: "text-warning",
    glowColor: "bg-warning/15",
    glowShadow: "shadow-[0_0_30px_-10px_rgba(245,158,11,0.35)]",
  },
];

const workflowSteps = [
  { label: "Choose Type", icon: <Sparkles className="w-4 h-4" />, color: "text-brand" },
  { label: "Configure", icon: <Zap className="w-4 h-4" />, color: "text-accent" },
  { label: "Deploy", icon: <Bot className="w-4 h-4" />, color: "text-success" },
  { label: "Integrate", icon: <ArrowRight className="w-4 h-4" />, color: "text-warning" },
];

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_-5px_var(--brand-glow)] group-hover:shadow-[0_0_30px_-5px_var(--brand-glow)] transition-shadow">
              <Bot className="w-5 h-5 text-text-on-brand" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">ChatBuild</span>
          </a>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#options"
              className="px-5 py-2.5 text-sm font-semibold text-text-on-brand bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-[0_0_20px_-5px_var(--brand-glow)] hover:shadow-[0_0_30px_-5px_var(--brand-glow)] hover:-translate-y-0.5"
            >
              Start Building
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-text-secondary hover:text-text-primary">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-elevated/95 backdrop-blur-xl border-b border-border-default overflow-hidden"
          >
            <div className="px-4 py-6">
              <a
                href="#options"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-center text-text-on-brand bg-brand rounded-xl font-semibold"
              >
                Start Building
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/* Hero Section                                                        */
/* ------------------------------------------------------------------ */
function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[var(--grad-radial)]" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-grad-start/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-grad-end/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[150px]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-glass border border-border-glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-secondary">AI Builder Platform</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Choose What You Want to{" "}
            <span className="bg-gradient-to-r from-grad-start via-grad-mid to-grad-end bg-clip-text text-transparent">
              Build
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-text-muted leading-relaxed mb-12 max-w-2xl"
          >
            From simple chatbots to advanced multi-agent workflows, create powerful AI systems without complex setup.
          </motion.p>

          {/* Workflow Diagram */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-0 mb-12">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.4 }}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl bg-bg-glass border border-border-glass backdrop-blur-md"
                >
                  <span className={step.color}>{step.icon}</span>
                  <span className="text-sm font-semibold text-text-primary">{step.label}</span>
                </motion.div>
                {i < workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 32 }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.4 }}
                    className="w-px bg-gradient-to-b from-border-glass to-brand/50 my-1"
                  />
                )}
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <a
              href="#options"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-text-on-brand bg-brand hover:bg-brand-hover rounded-xl transition-all shadow-[0_0_30px_-5px_var(--brand-glow)] hover:shadow-[0_0_40px_-5px_var(--brand-glow)] hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5" />
              Start Building
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Builder Card                                                        */
/* ------------------------------------------------------------------ */
function BuilderCard({ option, index }: { option: BuilderOption; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={scaleIn}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(option.href)}
      className="group relative cursor-pointer"
    >
      {/* Glow layer — uses existing semantic colors */}
      <motion.div
        className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${option.glowColor}`}
        animate={{ opacity: hovered ? 0.5 : 0 }}
      />

      <div
        className={`relative h-full rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl p-7 md:p-8 transition-all duration-300 group-hover:bg-bg-glass-hover group-hover:-translate-y-1 ${option.glowShadow}`}
      >
        {/* Top row: Icon + Arrow */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={`w-14 h-14 rounded-2xl ${option.glowColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
          >
            <span className={option.iconColor}>{option.icon}</span>
          </div>
          <motion.div
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-10 h-10 rounded-xl bg-bg-glass border border-border-glass flex items-center justify-center text-text-muted group-hover:text-text-primary transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary mb-3">
          {option.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed mb-6">
          {option.description}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-8">
          {option.features.map((feat, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-success shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        {/* Button */}
        <div
          className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 border ${
            hovered
              ? "bg-brand text-text-on-brand border-brand shadow-[0_0_20px_-5px_var(--brand-glow)]"
              : "bg-bg-glass text-text-primary border-border-glass"
          }`}
        >
          {option.buttonText}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Builder Options Section                                          */
/* ------------------------------------------------------------------ */
function BuilderOptionsSection() {
  return (
    <section id="options" className="py-24 md:py-32 relative bg-bg-elevated/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-text-primary via-text-secondary to-text-muted bg-clip-text text-transparent"
          >
            Select Your AI Experience
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-text-muted text-lg md:text-xl leading-relaxed">
            Choose the solution that matches your use case.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {builderOptions.map((option) => (
            <BuilderCard key={option.id} option={option} index={0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function AIBuilderSelectionPage() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary antialiased selection:bg-brand-glow selection:text-text-primary">
      <Navbar />
      <HeroSection />
      <BuilderOptionsSection />
    </main>
  );
}