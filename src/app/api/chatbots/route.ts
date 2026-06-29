import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptApiKey } from "@/lib/crypto";
import { createChatbotSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth";

/** GET /api/chatbots — List all chatbots (no API keys returned) */
export async function GET(req: NextRequest) {

  try {
       const { user, error } = await requireAuth()
   if (error) return error
    const where = user.role === "admin" ? {} : { userId: user.id }


    const chatbots = await prisma.chatbot.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        botId: true,
        botName: true,
        botDesc: true,
        avatarUrl: true,
        provider: true,
        model: true,
        responseStyle: true,
        welcomeMsg: true,
        primaryColor: true,
        widgetPos: true,
        widgetTitle: true,
        status: true,
        totalChats: true,
        totalMessages: true,
        createdAt: true,
        updatedAt: true,
        questions: {
          select: { id: true, question: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: chatbots });
  } catch (error) {
    console.error("[GET /api/chatbots]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chatbots" },
      { status: 500 }
    );
  }
}

/** POST /api/chatbots — Create new chatbot */
export async function POST(req: NextRequest) {
  try {
     const { user, error } = await requireAuth()
  if (error) return error
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimit = checkRateLimit(`api:${ip}`, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429, headers: { "X-RateLimit-Reset": String(rateLimit.resetTime) } }
      );
    }

    const body = await req.json();
    const parsed = createChatbotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Encrypt API key
    const encrypted = encryptApiKey(data.apiKey);

    // Generate public bot ID
    const botId = "bot_" + Math.random().toString(36).substring(2, 11);
console.log("avatarUrl:", data.avatarUrl);
console.log("type:", typeof data.avatarUrl);
console.log("length:", data.avatarUrl?.length);
    // Create chatbot data.avatarUrl
    const chatbot = await prisma.chatbot.create({
      data: {
        botId,
        botName: data.botName,
        botDesc: data.botDesc,
        avatarUrl: null,
        provider: data.provider,
        model: data.model,
        apiKey: encrypted.encrypted,
        apiKeyIv: encrypted.iv,
        apiKeyTag: encrypted.tag,
        systemPrompt: data.systemPrompt,
        responseStyle: data.responseStyle,
        temperature: data.responseStyle === "precise" ? 0.2 : data.responseStyle === "creative" ? 1.2 : 0.7,
        welcomeMsg: data.welcomeMsg,
        primaryColor: data.primaryColor,
        widgetPos: data.widgetPos,
        widgetTitle: data.widgetTitle,
          userId: user.id,
        questions: {
          create: data.questions.map((q, i) => ({ question: q, order: i })),
        },
      },
      select: {
        id: true,
        botId: true,
        botName: true,
        botDesc: true,
        avatarUrl: true,
        provider: true,
        model: true,
        responseStyle: true,
        welcomeMsg: true,
        primaryColor: true,
        widgetPos: true,
        widgetTitle: true,
        status: true,
        createdAt: true,
        questions: { select: { id: true, question: true, order: true } },
      },
     
    });

    return NextResponse.json({ success: true, data: chatbot }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/chatbots]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create chatbot" },
      { status: 500 }
    );
  }
}