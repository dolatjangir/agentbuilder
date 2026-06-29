"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Bot,
  Brain,
  BookOpen,
  Workflow,
  Settings,
  LogOut,
  MessageSquare,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: <Bot className="w-5 h-5" /> },
  { href: "/dashboard/chatbots", label: "Chatbot Maker", icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/dashboard/ai-agents", label: "AI Agent Maker", icon: <Brain className="w-5 h-5" /> },
  { href: "/dashboard/workflows", label: "Multi-Agent Workflows", icon: <Workflow className="w-5 h-5" /> },
  { href: "/dashboard/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
]

export function Sidebar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <aside className="w-64 bg-bg-card border-r border-border-default flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </aside>
    )
  }

  if (!session?.user) return null

  return (
    <aside className="w-64 bg-bg-card border-r border-border-default flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
            <Bot className="w-5 h-5 text-text-on-brand" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary">Agent Builder</h1>
            <p className="text-xs text-text-muted">User Workspace</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand/10 text-brand border border-brand/20"
                  : "text-text-secondary hover:bg-bg-glass hover:text-text-primary"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border-default">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center">
            <span className="text-sm font-bold text-text-primary">
              {session.user.name?.[0] || session.user.email?.[0] || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {session.user.name || session.user.email}
            </p>
            <p className="text-xs text-text-muted">Free Plan</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-error/10 hover:text-error transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}