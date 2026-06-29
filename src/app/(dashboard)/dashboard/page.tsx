"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import {
  Bot,
  BookOpen,
  Brain,
  Workflow,
  ArrowRight,
  Plus,
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user) return null

  const makers = [
    {
      title: "Chatbot Maker",
      desc: "Build AI chatbots with custom knowledge",
      icon: <Bot className="w-6 h-6" />,
      href: "/dashboard/chatbots",
      color: "text-brand",
      bg: "bg-brand/10",
      count: 0,
    },
    {
      title: "Knowledge Base",
      desc: "Upload PDFs, create vector databases",
      icon: <BookOpen className="w-6 h-6" />,
      href: "/dashboard/knowledge-base",
      color: "text-accent",
      bg: "bg-accent/10",
      count: 0,
    },
    {
      title: "AI Agent Maker",
      desc: "Create agents with tools & memory",
      icon: <Brain className="w-6 h-6" />,
      href: "/dashboard/ai-agents",
      color: "text-success",
      bg: "bg-success/10",
      count: 0,
    },
    {
      title: "Multi-Agent Workflows",
      desc: "Orchestrate collaborative AI teams",
      icon: <Workflow className="w-6 h-6" />,
      href: "/dashboard/workflows",
      color: "text-brand-secondary",
      bg: "bg-brand-secondary/10",
      count: 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {session.user.name || "Builder"} 👋
        </h1>
        <p className="text-text-muted mt-1">Manage your AI projects from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {makers.map((maker) => (
          <Link
            key={maker.title}
            href={maker.href}
            className="block p-6 rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl hover:bg-bg-glass-hover transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${maker.bg} flex items-center justify-center mb-4 ${maker.color}`}>
              {maker.icon}
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{maker.title}</h3>
            <p className="text-sm text-text-muted mt-1">{maker.desc}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-text-primary">{maker.count}</span>
              <span className="flex items-center gap-1 text-sm text-brand opacity-0 group-hover:opacity-100 transition-all">
                Open <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/chatbots/new"
          className="flex items-center gap-4 p-5 rounded-2xl border border-border-card bg-bg-card hover:bg-bg-glass-hover transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Create New Chatbot</h3>
            <p className="text-sm text-text-muted">Start with a custom AI assistant</p>
          </div>
        </Link>
        <Link
          href="/dashboard/knowledge-base/new"
          className="flex items-center gap-4 p-5 rounded-2xl border border-border-card bg-bg-card hover:bg-bg-glass-hover transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Upload Knowledge</h3>
            <p className="text-sm text-text-muted">Add PDFs for RAG-powered responses</p>
          </div>
        </Link>
      </div>
    </div>
  )
}