import { z } from "zod";

export const createChatbotSchema = z.object({
  botName: z.string().min(1, "Bot name is required").max(100),
  botDesc: z.string().max(500).optional(),
  provider: z.enum(["gemini", "openai", "claude", "openrouter"]),
  model: z.string().min(1),
  apiKey: z.string().min(1, "API key is required"),
  systemPrompt: z.string().max(10000).default(
    "You are a professional customer support assistant.\n\nHelp users politely and accurately.\n\nNever provide misleading information."
  ),
  responseStyle: z.enum(["precise", "balanced", "creative"]).default("balanced"),
  welcomeMsg: z.string().max(2000).default("Hello 👋\n\nHow can I help you today?"),
  questions: z.array(z.string().max(500)).max(8).default([]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#6366f1"),
  widgetPos: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  widgetTitle: z.string().max(100).default("Support Assistant"),
  avatarUrl: z.string().url().optional().nullable(),
});

export const updateChatbotSchema = createChatbotSchema.partial().omit({ apiKey: true });

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
});

export type CreateChatbotInput = z.infer<typeof createChatbotSchema>;
export type UpdateChatbotInput = z.infer<typeof updateChatbotSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;