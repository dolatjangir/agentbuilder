import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/crypto";
import { getTemperature } from "@/lib/providers";
import { chatMessageSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

/** POST /api/chat/:botId/stream — Streaming chat with SSE */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params;

    // Rate limit
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimit = checkRateLimit(`chat-stream:${botId}:${ip}`, 30);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ success: false, error: "Rate limit exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const parsed = chatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid message format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, sessionId } = parsed.data;

    // Find chatbot
    const chatbot = await prisma.chatbot.findUnique({
      where: { botId },
    });

    if (!chatbot || chatbot.status !== "active") {
      return new Response(
        JSON.stringify({ success: false, error: "Chatbot not found or inactive" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Decrypt API key
    const apiKey = decryptApiKey({
      encrypted: chatbot.apiKey,
      iv: chatbot.apiKeyIv,
      tag: chatbot.apiKeyTag,
    });

    // Get session
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
        },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        role: "user",
        content: message,
        chatbotId: chatbot.id,
        sessionId: session.id,
      },
    });

    // Build messages for provider
    const previousMessages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: 20,
      select: { role: true, content: true },
    });

    // Stream based on provider
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send session ID first
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "session", sessionId: session!.sessionId })}\n\n`)
          );

          if (chatbot.provider === "openai") {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: chatbot.model,
                messages: [
                  { role: "system", content: chatbot.systemPrompt },
                  ...previousMessages.map((m) => ({ role: m.role, content: m.content })),
                ],
                temperature: getTemperature(chatbot.responseStyle),
                stream: true,
              }),
            });

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split("\n").filter((line) => line.trim().startsWith("data: "));

              for (const line of lines) {
                const data = line.replace("data: ", "");
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content ?? "";
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`)
                    );
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          } else {
            // Non-streaming fallback for other providers
            const { callProvider } = await import("@/lib/providers");
            const result = await callProvider(chatbot.provider, {
              model: chatbot.model,
              messages: previousMessages,
              temperature: getTemperature(chatbot.responseStyle),
              systemPrompt: chatbot.systemPrompt,
              apiKey: { encrypted: chatbot.apiKey, iv: chatbot.apiKeyIv, tag: chatbot.apiKeyTag },
            });

            fullResponse = result.content;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: fullResponse })}\n\n`)
            );
          }

          // Save assistant message
          await prisma.chatMessage.create({
            data: {
              role: "assistant",
              content: fullResponse,
              chatbotId: chatbot.id,
              sessionId: session!.id,
              providerUsed: chatbot.provider,
              modelUsed: chatbot.model,
            },
          });

          // Update stats
          await prisma.chatbot.update({
            where: { id: chatbot.id },
            data: { totalMessages: { increment: 2 } },
          });

          // Send done event
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: String(err) })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[POST /api/chat/:botId/stream]", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to process stream" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** OPTIONS — CORS preflight */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}