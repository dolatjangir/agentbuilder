"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react"

interface DeleteChatbotProps {
  botId: string
  botName: string
  onDeleted?: () => void
}

export function DeleteChatbot({ botId, botName, onDeleted }: DeleteChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const res = await fetch(`/api/chatbots/${botId}`, {
        method: "DELETE",
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error || "Failed to delete chatbot")
      }

      setIsOpen(false)
      onDeleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Delete Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all"
        title="Delete chatbot"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
            >
              <div className="bg-bg-card rounded-2xl border border-border-card shadow-2xl p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-text-primary">Delete Chatbot</h3>
                    <p className="text-sm text-text-muted">This action cannot be undone.</p>
                  </div>
                  <button
                    onClick={() => !isDeleting && setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-bg-glass-hover transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>

                {/* Warning Box - FIXED COLORS */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-300 leading-relaxed">
                    Are you sure you want to delete <strong className="font-semibold text-red-200">{botName}</strong>?
                    All conversations, settings, and data will be permanently removed.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => !isDeleting && setIsOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-bg-glass border border-border-glass hover:text-text-primary hover:bg-bg-glass-hover transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}