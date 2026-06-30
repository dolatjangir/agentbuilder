import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callProvider, getTemperature } from "@/lib/providers";
import { chatMessageSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}


/** POST /api/chat/:botId — Public chat endpoint (for widget/embed) */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;

    // Rate limit by IP + botId
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimit = checkRateLimit(`chat:${botId}:${ip}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Try again later." },
        {
          status: 429,
          headers: {
              ...corsHeaders,
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetTime),
          },
        }
      );
    }

    // Parse body
    const body = await req.json();
    const parsed = chatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid message format" },
        { status: 400, headers: corsHeaders  }
      );
    }

    const { message, sessionId } = parsed.data;

    // Find chatbot
    const chatbot = await prisma.chatbot.findUnique({
      where: { botId },
      include: { questions: true },
    });

    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: "Chatbot not found" },
        { status: 404, headers: corsHeaders  }
      );
    }

    if (chatbot.status !== "active") {
      return NextResponse.json(
        { success: false, error: "This chatbot is currently unavailable" },
        { status: 403 , headers: corsHeaders }
      );
    }

    // Get or create session
    let session = sessionId
      ? await prisma.chatSession.findUnique({ where: { sessionId } })
      : null;

    if (!session) {
      const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      session = await prisma.chatSession.create({
        data: {
          sessionId: newSessionId,
          chatbotId: chatbot.id,
          ipAddress: ip,
          userAgent: req.headers.get("user-agent") ?? null,
        },
      });
    }

    // Fetch previous messages for context
    const previousMessages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: 20, // Last 20 messages for context
      select: { role: true, content: true },
    });

    // Save user message
    await prisma.chatMessage.create({
      data: {
        role: "user",
        content: message,
        chatbotId: chatbot.id,
        sessionId: session.id,
      },
    });

    // Call AI provider
    const response = await callProvider(chatbot.provider, {
      model: chatbot.model,
      messages: previousMessages,
      temperature: getTemperature(chatbot.responseStyle),
      systemPrompt: chatbot.systemPrompt,
      apiKey: {
        encrypted: chatbot.apiKey,
        iv: chatbot.apiKeyIv,
        tag: chatbot.apiKeyTag,
      },
    });

    // Save assistant response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        role: "assistant",
        content: response.content,
        chatbotId: chatbot.id,
        sessionId: session.id,
        providerUsed: chatbot.provider,
        modelUsed: chatbot.model,
        tokensUsed: response.tokensUsed,
      },
    });

    // Update stats
    await prisma.chatbot.update({
      where: { id: chatbot.id },
      data: {
        totalMessages: { increment: 2 },
      },
    });

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        messageCount: { increment: 2 },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
          reply: response.content,
        message: {
          id: assistantMessage.id,
          role: "assistant",
          content: response.content,
        },
        sessionId: session.sessionId,
      },
    });
  } catch (error) {
    console.error("[POST /api/chat/:botId]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process message",
      },
      { status: 500 , headers: corsHeaders }
    );
  }
}

/** OPTIONS /api/chat/:botId — CORS preflight */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
   headers: corsHeaders,
  });
}