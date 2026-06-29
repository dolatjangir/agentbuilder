"use client"

import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="h-16 bg-bg-card/50 backdrop-blur-xl border-b border-border-default flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 w-64 rounded-xl bg-bg-input border border-border-input text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">
          {session?.user?.email}
        </span>
        <button className="relative p-2 rounded-xl bg-bg-glass border border-border-glass text-text-secondary hover:text-text-primary transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
        </button>
      </div>
    </header>
  )
}