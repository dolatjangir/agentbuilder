"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  Bot,
  BarChart3,
  Shield,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

const adminNav = [
  { href: "/admin", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/chatbots", label: "All Chatbots", icon: <Bot className="w-5 h-5" /> },
  { href: "/admin/agents", label: "All Agents", icon: <Shield className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
]

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-bg-card border-r border-border-default flex flex-col">
      <div className="p-6 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-error" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary">Agent Builder</h1>
            <p className="text-xs text-error font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {adminNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-error/10 text-error border border-error/20"
                  : "text-text-secondary hover:bg-bg-glass hover:text-text-primary"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border-default">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center">
            <span className="text-sm font-bold text-error">{user.name?.[0] || "A"}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{user.name || user.email}</p>
            <p className="text-xs text-error">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ redirectTo: "/login" })}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-error/10 hover:text-error transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}