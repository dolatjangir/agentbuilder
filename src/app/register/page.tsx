"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Eye, EyeOff, Loader2, ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [password, setPassword] = useState("")

  const hasMinLength = password.length >= 6
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        setIsLoading(false)
        return
      }

      // Redirect to login on success
      router.push("/login?registered=true")
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_-5px_var(--brand-glow)]">
            <Bot className="w-5 h-5 text-text-on-brand" />
          </div>
          <span className="text-xl font-bold text-text-primary">Agent Builder</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border-card bg-bg-card backdrop-blur-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
            <p className="text-sm text-text-muted mt-1">Start building AI agents</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-sm text-error"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs">
                  {hasMinLength ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-text-muted" />}
                  <span className={hasMinLength ? "text-success" : "text-text-muted"}>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {hasLetter ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-text-muted" />}
                  <span className={hasLetter ? "text-success" : "text-text-muted"}>Contains a letter</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {hasNumber ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-text-muted" />}
                  <span className={hasNumber ? "text-success" : "text-text-muted"}>Contains a number</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-input text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-text-on-brand font-semibold text-sm transition-all shadow-[0_0_20px_-5px_var(--brand-glow)] hover:shadow-[0_0_30px_-5px_var(--brand-glow)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="text-brand hover:text-brand-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}